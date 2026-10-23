import { getContent } from "i18n/content";
import { fallbackMessages } from "i18n/fallbackMessages";
import { DEFAULT_LOCALE } from "i18n/locales";
import { localePath } from "i18n/paths";

describe("fallbackMessages", () => {
    it("should hold the default language's texts of the system pages", () => {
        const { ui } = getContent(DEFAULT_LOCALE);

        expect(fallbackMessages).toMatchObject({
            homeHref: localePath(DEFAULT_LOCALE),
            home: ui.home,
            notFound: ui.notFound,
            error: ui.error,
        });
    });
});
