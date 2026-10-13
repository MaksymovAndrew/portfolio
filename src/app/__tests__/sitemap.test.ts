import { SITE_URL } from "config/site";

import { LOCALES } from "i18n/locales";
import { languageAlternates, localeUrl } from "i18n/paths";

import sitemap from "app/sitemap";

describe("sitemap", () => {
    it("should list one address per language", () => {
        expect(sitemap().map((entry) => entry.url)).toEqual(
            LOCALES.map((locale) => localeUrl(locale, SITE_URL)),
        );
    });

    it("should give every address all languages and x-default", () => {
        expect(sitemap().map((entry) => entry.alternates?.languages)).toEqual(
            LOCALES.map(() => languageAlternates(SITE_URL)),
        );
    });
});
