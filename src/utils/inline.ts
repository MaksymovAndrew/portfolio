import type { Refs } from "types/content";

export type InlineNode =
    | { type: "text"; value: string }
    | { type: "strong"; value: string }
    | { type: "accent"; value: string }
    | { type: "link"; value: string; href: string; external: boolean };

export class InlineMarkupError extends Error {}

type Token =
    | Exclude<InlineNode, { type: "link" }>
    | { type: "link"; value: string; target: string };

interface Read<T> {
    value: T;
    next: number;
}

const ESCAPE = "\\";
const ESCAPABLE = new Set(["*", "[", "]", ")"]);
const ESCAPED = /\\([*[\])])/g;
const MARKER = /[*[]/;
const WHITESPACE = /\s/;
const PARENTHESIS = /[()]/;
const ANCHOR = /^#[\w-]+$/;
// not "//host" or "/\host": browsers read both as another site
const PAGE_PATH = /^\/(?![/\\])\S*$/;
const SAFE_PROTOCOLS = new Set(["https:", "mailto:"]);
const PLACEHOLDER = /\{(\w+)\}/g;

const markupError = (text: string, problem: string) =>
    new InlineMarkupError(`${problem} in "${text}"`);

const isEscaped = (text: string, index: number): boolean =>
    text.charAt(index) === ESCAPE && ESCAPABLE.has(text.charAt(index + 1));

const findClosing = (text: string, closing: string, from: number): number => {
    let end = text.indexOf(closing, from);

    while (end > from && text.charAt(end - 1) === ESCAPE) {
        end = text.indexOf(closing, end + 1);
    }

    return end;
};

// the text between two markers: no markup of its own, escapes resolved
const readContent = (
    text: string,
    from: number,
    closing: string,
): Read<string> => {
    const end = findClosing(text, closing, from);

    if (end === -1) {
        throw markupError(text, `missing "${closing}"`);
    }

    const raw = text.slice(from, end);

    if (MARKER.test(raw.replace(ESCAPED, ""))) {
        throw markupError(text, "nested markup");
    }

    const value = raw.replace(ESCAPED, "$1");

    if (!value.trim()) {
        throw markupError(text, "empty markup");
    }

    return { value, next: end + closing.length };
};

const readLink = (text: string, from: number): Read<Token> => {
    const label = readContent(text, from, "]");

    if (!text.startsWith("(", label.next)) {
        throw markupError(text, 'missing "(target)" after "]"');
    }

    const target = readContent(text, label.next + 1, ")");

    if (WHITESPACE.test(target.value)) {
        throw markupError(text, "a space in a link target");
    }

    if (PARENTHESIS.test(target.value)) {
        throw markupError(
            text,
            "a parenthesis in a link target: put the address in refs and link to @key",
        );
    }

    return {
        value: { type: "link", value: label.value, target: target.value },
        next: target.next,
    };
};

const readToken = (text: string, index: number): Read<Token> | null => {
    if (text.startsWith("**", index)) {
        const { value, next } = readContent(text, index + 2, "**");

        return { value: { type: "strong", value }, next };
    }

    if (text.startsWith("*", index)) {
        const { value, next } = readContent(text, index + 1, "*");

        // the "*" that closed the accent opens bold text inside it
        if (text.startsWith("*", next)) {
            throw markupError(text, "nested markup");
        }

        return { value: { type: "accent", value }, next };
    }

    return text.startsWith("[", index) ? readLink(text, index + 1) : null;
};

const tokenize = (text: string): Token[] => {
    const tokens: Token[] = [];
    let plain = "";
    let index = 0;

    while (index < text.length) {
        const escaped = isEscaped(text, index);
        const token = escaped ? null : readToken(text, index);

        if (token) {
            if (plain) {
                tokens.push({ type: "text", value: plain });
            }

            tokens.push(token.value);
            plain = "";
            index = token.next;
        } else {
            const step = escaped ? 2 : 1;

            plain += text.charAt(index + step - 1);
            index += step;
        }
    }

    return plain ? [...tokens, { type: "text", value: plain }] : tokens;
};

const isLocalHref = (href: string): boolean =>
    ANCHOR.test(href) || PAGE_PATH.test(href);

const protocolOf = (href: string): string | null =>
    URL.canParse(href) ? new URL(href).protocol : null;

export const isSafeHref = (href: string): boolean =>
    isLocalHref(href) || SAFE_PROTOCOLS.has(protocolOf(href) ?? "");

const lookUp = (refs: Refs | undefined, key: string): string | null =>
    refs && Object.hasOwn(refs, key) ? (refs[key] ?? null) : null;

const resolveTarget = (text: string, target: string, refs?: Refs) => {
    const href = target.startsWith("@")
        ? lookUp(refs, target.slice(1))
        : target;

    if (!href) {
        throw markupError(text, `unknown key "${target}"`);
    }

    if (!isSafeHref(href)) {
        throw markupError(text, `unsafe target "${target}"`);
    }

    return { href, external: protocolOf(href) === "https:" };
};

// targets: https:, mailto:, #anchor, /path, or @key looked up in refs
export const parseInline = (text: string, refs?: Refs): readonly InlineNode[] =>
    tokenize(text).map((token) =>
        token.type === "link"
            ? {
                  type: "link",
                  value: token.value,
                  ...resolveTarget(text, token.target, refs),
              }
            : token,
    );

// for meta tags, structured data and the preview card: the words without the markers
export const toPlainText = (text: string): string =>
    tokenize(text)
        .map((token) => token.value)
        .join("");

export const format = (
    template: string,
    values: Readonly<Record<string, string>>,
): string =>
    template.replace(PLACEHOLDER, (placeholder, key: string) => {
        const value = values[key];

        if (typeof value !== "string") {
            throw new Error(`No value for ${placeholder} in "${template}"`);
        }

        return value;
    });
