export interface LocaleRoutingConfig {
    locales: readonly string[];
    defaultLocale: string;
    pages: readonly string[];
    notFoundSegment: string;
}

export type LocaleRoute =
    | { kind: "pass" }
    | { kind: "rewrite"; pathname: string }
    | { kind: "redirect"; pathname: string }
    | { kind: "notFound"; pathname: string };

const ROOT = "/";

// "/pl/a/b" -> ["pl", "/a/b"], "/pl" -> ["pl", "/"]
const splitFirstSegment = (pathname: string): [string, string] => {
    const end = pathname.indexOf("/", 1);

    return end === -1
        ? [pathname.slice(1), ROOT]
        : [pathname.slice(1, end), pathname.slice(end)];
};

const prefixed = (locale: string, pathname: string): string =>
    pathname === ROOT ? `/${locale}` : `/${locale}${pathname}`;

// the default language is served at the bare address, every other one under its prefix
export const createLocaleRouting = ({
    locales,
    defaultLocale,
    pages,
    notFoundSegment,
}: LocaleRoutingConfig) => {
    const notFound = (locale: string): LocaleRoute => ({
        kind: "notFound",
        pathname: `/${locale}/${notFoundSegment}`,
    });

    const resolve = (pathname: string): LocaleRoute => {
        const [first, rest] = splitFirstSegment(pathname);

        if (first === defaultLocale) {
            return { kind: "redirect", pathname: rest };
        }

        if (locales.includes(first)) {
            return pages.includes(rest) ? { kind: "pass" } : notFound(first);
        }

        return pages.includes(pathname)
            ? { kind: "rewrite", pathname: prefixed(defaultLocale, pathname) }
            : notFound(defaultLocale);
    };

    return { resolve };
};
