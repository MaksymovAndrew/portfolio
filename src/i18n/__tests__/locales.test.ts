import { isLocale, LOCALES } from "i18n/locales";

describe("isLocale", () => {
    it("should accept every configured locale", () => {
        expect(LOCALES.every((locale) => isLocale(locale))).toBe(true);
    });

    it("should reject an unknown locale", () => {
        expect(isLocale(`${LOCALES.join("")}x`)).toBe(false);
    });
});
