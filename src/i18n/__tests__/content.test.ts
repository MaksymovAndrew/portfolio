import { source } from "content";

import { getContent } from "i18n/content";
import { LOCALES } from "i18n/locales";

describe("getContent", () => {
    it.each(LOCALES)("should fold the content to %s", (locale) => {
        const content = getContent(locale);

        expect(content.locale).toBe(locale);
        expect(content.hero.sub).toBe(source.hero.sub[locale]);
    });

    it("should build each language once", () => {
        const [locale] = LOCALES;

        expect(getContent(locale)).toBe(getContent(locale));
    });
});
