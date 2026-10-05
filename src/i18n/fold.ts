import type { Folded, Localized } from "types/content";

import type { Locale } from "i18n/locales";
import { LOCALES } from "i18n/locales";

export type Tree = Readonly<Record<string, unknown>>;

export const isTree = (value: unknown): value is Tree =>
    typeof value === "object" && value !== null;

// exactly one string per language and nothing else
export const isLocalized = (value: Tree): value is Localized =>
    Object.keys(value).length === LOCALES.length &&
    LOCALES.every((locale) => typeof value[locale] === "string");

const fold = (value: unknown, locale: Locale): unknown => {
    if (Array.isArray(value)) {
        return value.map((item: unknown) => fold(item, locale));
    }

    if (!isTree(value)) {
        return value;
    }

    return isLocalized(value)
        ? value[locale]
        : Object.fromEntries(
              Object.entries(value).map(([key, item]) => [
                  key,
                  fold(item, locale),
              ]),
          );
};

export const foldContent = <T>(source: T, locale: Locale): Folded<T> =>
    fold(source, locale) as Folded<T>;
