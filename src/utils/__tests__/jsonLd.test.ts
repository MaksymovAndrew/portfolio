import { APP_VERSION } from "config/app";

import { localeUrl, socialImagePath } from "i18n/paths";

import { buildProfileJsonLd } from "utils/jsonLd";

import { content } from "test/fixtures/content";

const SITE_URL = new URL("https://example.com");
const BUILD_TIME = new Date("2026-01-15T12:00:00Z");

describe("buildProfileJsonLd", () => {
    beforeEach(() => {
        jest.useFakeTimers({ now: BUILD_TIME });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should describe the page in its language as of the build", () => {
        expect(buildProfileJsonLd(content, SITE_URL)).toMatchObject({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: localeUrl(content.locale, SITE_URL),
            inLanguage: content.locale,
            dateModified: BUILD_TIME.toISOString(),
        });
    });

    it("should name the person with the profile links", () => {
        expect(buildProfileJsonLd(content, SITE_URL).mainEntity).toMatchObject({
            "@type": "Person",
            name: content.profile.name,
            description: content.seo.description,
            jobTitle: content.hero.eyebrow,
            sameAs: content.profile.links.map((link) => link.href),
            knowsLanguage: content.profile.languages.map(
                (language) => language.code,
            ),
            address: {
                "@type": "PostalAddress",
                addressLocality: content.profile.city,
            },
        });
    });

    it("should picture the person with the preview card of the page", () => {
        expect(buildProfileJsonLd(content, SITE_URL).mainEntity).toMatchObject({
            image: new URL(
                socialImagePath(content.locale, APP_VERSION),
                SITE_URL,
            ).href,
        });
    });

    it("should list the schools the person studied at", () => {
        expect(buildProfileJsonLd(content, SITE_URL).mainEntity).toMatchObject({
            alumniOf: content.education.entries.map((entry) => ({
                "@type": "EducationalOrganization",
                name: entry.organisation,
            })),
        });
    });

    it("should give every certificate one credential", () => {
        const [full, bare] = content.certifications.items;

        expect(buildProfileJsonLd(content, SITE_URL).mainEntity).toMatchObject({
            hasCredential: [
                {
                    "@type": "EducationalOccupationalCredential",
                    name: full?.title,
                    recognizedBy: {
                        "@type": "Organization",
                        name: full?.issuer,
                    },
                    dateCreated: full?.date,
                    url: full?.verifyHref,
                },
                {
                    "@type": "EducationalOccupationalCredential",
                    name: bare?.title,
                },
            ],
        });
    });

    it("should leave out the facts a certificate does not have", () => {
        const bare = buildProfileJsonLd(
            content,
            SITE_URL,
        ).mainEntity.hasCredential.at(-1);

        expect(bare).not.toHaveProperty("dateCreated");
        expect(bare).not.toHaveProperty("url");
    });
});
