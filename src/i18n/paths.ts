import type { Locale } from "i18n/locales";
import { DEFAULT_LOCALE } from "i18n/locales";

export const localePath = (locale: Locale): string =>
    locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
