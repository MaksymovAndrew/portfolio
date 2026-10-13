import { APP_VERSION } from "config/app";
import { SOCIAL_IMAGE } from "constants/social";

import { LOCALE_META, LOCALES } from "i18n/locales";
import { languageAlternates, localeUrl, socialImagePath } from "i18n/paths";

import { buildMetadata, buildNotFoundMetadata } from "utils/metadata";

import { content } from "test/fixtures/content";

const SITE_URL = new URL("https://example.com");

describe("buildMetadata", () => {
    it.each(LOCALES)(
        "should point the canonical address of %s at its own page",
        (locale) => {
            const metadata = buildMetadata({ ...content, locale }, SITE_URL);

            expect(metadata.alternates?.canonical).toBe(
                localeUrl(locale, SITE_URL),
            );
        },
    );

    it.each(LOCALES)(
        "should list every language and x-default as alternates of %s",
        (locale) => {
            const metadata = buildMetadata({ ...content, locale }, SITE_URL);

            expect(metadata.alternates?.languages).toEqual(
                languageAlternates(SITE_URL),
            );
        },
    );

    it.each(LOCALES)(
        "should give %s its Open Graph locale and the others as alternates",
        (locale) => {
            const metadata = buildMetadata({ ...content, locale }, SITE_URL);

            expect(metadata.openGraph).toMatchObject({
                locale: LOCALE_META[locale].openGraph,
                alternateLocale: LOCALES.filter(
                    (other) => other !== locale,
                ).map((other) => LOCALE_META[other].openGraph),
                url: localeUrl(locale, SITE_URL),
            });
        },
    );

    it.each(LOCALES)(
        "should show the preview card of %s at its versioned address",
        (locale) => {
            const metadata = buildMetadata({ ...content, locale }, SITE_URL);
            const image = {
                url: new URL(socialImagePath(locale, APP_VERSION), SITE_URL)
                    .href,
                width: SOCIAL_IMAGE.width,
                height: SOCIAL_IMAGE.height,
                type: SOCIAL_IMAGE.contentType,
                alt: content.seo.cardAlt,
            };

            expect(metadata.openGraph?.images).toEqual([image]);
            expect(metadata.twitter?.images).toEqual([image]);
        },
    );

    it("should describe the page with the words of its content", () => {
        const metadata = buildMetadata(content, SITE_URL);

        expect(metadata).toMatchObject({
            metadataBase: SITE_URL,
            title: content.seo.title,
            description: content.seo.description,
            openGraph: {
                type: "profile",
                siteName: content.profile.name,
                title: content.seo.title,
                description: content.seo.description,
            },
            twitter: { card: "summary_large_image" },
        });
    });
});

describe("buildNotFoundMetadata", () => {
    it("should name the missing page and keep it out of the index", () => {
        expect(buildNotFoundMetadata(content)).toMatchObject({
            title: content.ui.notFound.title,
            description: content.ui.notFound.text,
            robots: { index: false },
        });
    });

    it("should clear the addresses and previews of the home page", () => {
        expect(buildNotFoundMetadata(content)).toMatchObject({
            alternates: null,
            openGraph: null,
            twitter: null,
        });
    });
});
