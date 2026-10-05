import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";
import { localePath } from "i18n/paths";

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
