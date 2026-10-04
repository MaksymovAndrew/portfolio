import { LOCALES } from "content/locales";

export { DEFAULT_LOCALE, LOCALE_META, LOCALES } from "content/locales";

export type Locale = (typeof LOCALES)[number];

export const isLocale = (value: string): value is Locale =>
    LOCALES.some((locale) => locale === value);
