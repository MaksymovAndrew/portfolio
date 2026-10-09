import type { SectionId } from "types/content";

import type { Locale } from "i18n/locales";
import { DEFAULT_LOCALE, LOCALE_META, LOCALES } from "i18n/locales";

export interface LocaleLink {
    locale: string;
    href: string;
    label: string;
    name: string;
    current: boolean;
}

export const localePath = (locale: Locale): string =>
    locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

export const localeLinks = (current: Locale): readonly LocaleLink[] =>
    LOCALES.map((locale) => ({
        locale,
        href: localePath(locale),
        label: LOCALE_META[locale].label,
        name: LOCALE_META[locale].name,
        current: locale === current,
    }));

// a language's address with the section being read, so switching keeps the place: "/pl#experience"
export const localeHref = (href: string, section: SectionId | null): string =>
    section === null ? href : `${href}#${section}`;
