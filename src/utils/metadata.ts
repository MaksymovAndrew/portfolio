import type { Metadata } from "next";

import type { Content } from "types/content";

import { LOCALE_META, LOCALES } from "i18n/locales";
import { languageAlternates, localeUrl } from "i18n/paths";

// the only writer of head tags: a child segment's openGraph would replace this whole object, not merge into it
export const buildMetadata = (content: Content, siteUrl: URL): Metadata => {
    const { locale, seo, profile } = content;
    const url = localeUrl(locale, siteUrl);

    return {
        metadataBase: siteUrl,
        title: seo.title,
        description: seo.description,
        alternates: {
            canonical: url,
            languages: languageAlternates(siteUrl),
        },
        openGraph: {
            type: "profile",
            siteName: profile.name,
            title: seo.title,
            description: seo.description,
            url,
            locale: LOCALE_META[locale].openGraph,
            alternateLocale: LOCALES.filter((other) => other !== locale).map(
                (other) => LOCALE_META[other].openGraph,
            ),
        },
        twitter: { card: "summary_large_image" },
    };
};

// an unknown address is no copy of the home page: no canonical, no alternates, no preview of the home page
export const buildNotFoundMetadata = ({ ui }: Content): Metadata => ({
    title: ui.notFound.heading,
    description: ui.notFound.text,
    robots: { index: false },
    alternates: null,
    openGraph: null,
    twitter: null,
});
