import type { MetadataRoute } from "next";

import { SITE_URL } from "config/site";

import { LOCALES } from "i18n/locales";
import { languageAlternates, localeUrl } from "i18n/paths";

// each language names all the others, its own and x-default included, so each is indexed in its own right
const sitemap = (): MetadataRoute.Sitemap => {
    const languages = languageAlternates(SITE_URL);

    return LOCALES.map((locale) => ({
        url: localeUrl(locale, SITE_URL),
        alternates: { languages },
    }));
};

export default sitemap;
