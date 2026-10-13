import { DEFAULT_LOCALE, LOCALE_META, LOCALES } from "i18n/locales";
import {
    languageAlternates,
    localeHref,
    localeLinks,
    localePath,
    localeUrl,
    socialImagePath,
} from "i18n/paths";

const SITE_URL = new URL("https://example.com");

describe("localePath", () => {
    it("should place the default language at the root", () => {
        expect(localePath(DEFAULT_LOCALE)).toBe("/");
    });

    it("should place every other language under its prefix", () => {
        const others = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

        expect(others.map(localePath)).toEqual(
            others.map((locale) => `/${locale}`),
        );
    });
});

describe("localeLinks", () => {
    it("should give every language its address and names", () => {
        expect(localeLinks(DEFAULT_LOCALE)).toEqual(
            LOCALES.map((locale) => ({
                locale,
                href: localePath(locale),
                label: LOCALE_META[locale].label,
                name: LOCALE_META[locale].name,
                current: locale === DEFAULT_LOCALE,
            })),
        );
    });

    it("should mark only the language of the page", () => {
        const current = LOCALES.at(-1) ?? DEFAULT_LOCALE;

        expect(
            localeLinks(current)
                .filter((link) => link.current)
                .map((link) => link.locale),
        ).toEqual([current]);
    });
});

describe("localeHref", () => {
    it("should keep the address of a language when no section is current", () => {
        expect(localeHref("/", null)).toBe("/");
        expect(localeHref("/de", null)).toBe("/de");
    });

    it("should carry the current section into the address", () => {
        expect(localeHref("/", "about")).toBe("/#about");
        expect(localeHref("/de", "about")).toBe("/de#about");
    });
});

describe("localeUrl", () => {
    it("should give the default language the root of the site", () => {
        expect(localeUrl(DEFAULT_LOCALE, SITE_URL)).toBe(
            "https://example.com/",
        );
    });

    it("should give every other language the site with its prefix", () => {
        const others = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

        expect(others.map((locale) => localeUrl(locale, SITE_URL))).toEqual(
            others.map((locale) => `https://example.com/${locale}`),
        );
    });
});

describe("languageAlternates", () => {
    it("should name every language and send x-default to the default one", () => {
        expect(languageAlternates(SITE_URL)).toEqual({
            ...Object.fromEntries(
                LOCALES.map((locale) => [locale, localeUrl(locale, SITE_URL)]),
            ),
            "x-default": localeUrl(DEFAULT_LOCALE, SITE_URL),
        });
    });
});

describe("socialImagePath", () => {
    it("should name every language's card after it and carry the version", () => {
        expect(
            LOCALES.map((locale) => socialImagePath(locale, "1.2.3")),
        ).toEqual(LOCALES.map((locale) => `/social/${locale}.png?v=1.2.3`));
    });
});
