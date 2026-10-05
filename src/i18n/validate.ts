import type { ContentSource, Period, Refs } from "types/content";

import type { Found } from "i18n/fields";
import {
    fileFields,
    linkFields,
    monthFields,
    periodFields,
    refsFields,
    richFields,
} from "i18n/fields";
import type { Tree } from "i18n/fold";
import { isLocalized, isTree } from "i18n/fold";
import { isLocale, LOCALES } from "i18n/locales";

import { InlineMarkupError, isSafeHref, parseInline } from "utils/inline";

export interface ContentIssue {
    path: string;
    message: string;
}

export interface PublicFiles {
    exists(publicPath: string): boolean;
}

const MONTH = /^\d{4}-(?:0[1-9]|1[0-2])$/;

// an object built by a helper escapes the excess property check, so a stray language shows up only here
const languageIssues = (record: Tree, path: string): ContentIssue[] =>
    Object.keys(record).some(isLocale) && !isLocalized(record)
        ? [
              {
                  path,
                  message: `needs exactly the languages ${LOCALES.join(", ")}`,
              },
          ]
        : [];

const textIssues = (value: unknown, path: string): ContentIssue[] => {
    if (typeof value === "string") {
        return value.trim() ? [] : [{ path, message: "empty text" }];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item: unknown, index) =>
            textIssues(item, `${path}[${index}]`),
        );
    }

    return isTree(value)
        ? [
              ...languageIssues(value, path),
              ...Object.entries(value).flatMap(([key, item]) =>
                  textIssues(item, path ? `${path}.${key}` : key),
              ),
          ]
        : [];
};

const markupProblem = (text: string, refs: Refs): string | null => {
    try {
        parseInline(text, refs);

        return null;
    } catch (error) {
        if (error instanceof InlineMarkupError) {
            return error.message;
        }

        throw error;
    }
};

const markupIssues = (source: ContentSource): ContentIssue[] =>
    richFields(source).flatMap(({ path, value, refs }) =>
        LOCALES.flatMap((locale) => {
            const message = markupProblem(value[locale], refs);

            return message ? [{ path: `${path}.${locale}`, message }] : [];
        }),
    );

// a refs object keyed by the language codes would be folded like a translated text
const refsIssues = (source: ContentSource): ContentIssue[] =>
    refsFields(source)
        .filter(({ value }) => isLocalized(value))
        .map(({ path }) => ({
            path,
            message: "refs keys must not be the language codes",
        }));

const linkIssues = (source: ContentSource): ContentIssue[] =>
    linkFields(source)
        .filter(({ value }) => !isSafeHref(value))
        .map(({ path, value }) => ({
            path,
            message: `unsafe link "${value}"`,
        }));

// "/images/a.webp": from the root of public/, never above it
const isPublicPath = (value: string): boolean =>
    value.startsWith("/") && !value.split("/").includes("..");

const fileProblem = (value: string, files: PublicFiles): string | null => {
    if (!isPublicPath(value)) {
        return `"${value}" must start with / and stay inside public/`;
    }

    return files.exists(value) ? null : `no file public${value}`;
};

const fileIssues = (
    source: ContentSource,
    files: PublicFiles,
): ContentIssue[] =>
    fileFields(source).flatMap(({ path, value }) => {
        const message = fileProblem(value, files);

        return message ? [{ path, message }] : [];
    });

const sectionIssues = ({ site, hero }: ContentSource): ContentIssue[] => [
    ...site.sections
        .filter((id, index) => site.sections.indexOf(id) !== index)
        .map((id) => ({
            path: "site.sections",
            message: `"${id}" is listed twice`,
        })),
    ...hero.actions
        .map((action, index) => ({ action, index }))
        .filter(({ action }) => !site.sections.includes(action.target))
        .map(({ action, index }) => ({
            path: `hero.actions[${index}].target`,
            message: `"${action.target}" is not in site.sections`,
        })),
];

const monthIssues = ({ path, value }: Found<string | null>): ContentIssue[] =>
    value === null || MONTH.test(value)
        ? []
        : [{ path, message: `"${value}" is not a YYYY-MM month` }];

const periodIssues = ({ path, value }: Found<Period>): ContentIssue[] => {
    const issues = [
        ...monthIssues({ path: `${path}.start`, value: value.start }),
        ...monthIssues({ path: `${path}.end`, value: value.end }),
    ];
    const reversed =
        issues.length === 0 && value.end !== null && value.end < value.start;

    return reversed
        ? [{ path, message: "the period ends before it starts" }]
        : issues;
};

// every problem in the content, each with the path of the field it is in
export const validateContent = (
    source: ContentSource,
    files: PublicFiles,
): readonly ContentIssue[] => [
    ...textIssues(source, ""),
    ...markupIssues(source),
    ...refsIssues(source),
    ...linkIssues(source),
    ...fileIssues(source, files),
    ...sectionIssues(source),
    ...periodFields(source).flatMap(periodIssues),
    ...monthFields(source).flatMap(monthIssues),
];

export const assertValidContent = (
    source: ContentSource,
    files: PublicFiles,
): void => {
    const issues = validateContent(source, files);

    if (issues.length > 0) {
        const list = issues.map(({ path, message }) => `- ${path}: ${message}`);

        throw new Error(
            [`The content has ${issues.length} issue(s):`, ...list].join("\n"),
        );
    }
};
