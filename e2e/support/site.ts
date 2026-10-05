import { DEFAULT_LOCALE } from "content/locales";

export { DEFAULT_LOCALE, LOCALES } from "content/locales";

export const WIDTHS = [320, 375, 768, 1024, 1280, 1440] as const;

export const VIEWPORT_HEIGHT = 900;

// the default language lives at the root, every other one under its prefix
export const pathFor = (locale: string): string =>
    locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

// an address that exists in no language: "/no-such-page", "/pl/no-such-page"
export const missingPathFor = (locale: string): string =>
    `${pathFor(locale).replace(/\/$/, "")}/no-such-page`;
