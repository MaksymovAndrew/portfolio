import { APP_VERSION } from "config/app";
import { SCHEMA_CONTEXT } from "constants/schema";
import type { Content } from "types/content";

import { localeUrl, socialImagePath } from "i18n/paths";

type Certificate = Content["certifications"]["items"][number];

// a fact the certificate does not have is left out, not written as null
const credential = ({ title, issuer, date, verifyHref }: Certificate) => ({
    "@type": "EducationalOccupationalCredential",
    name: title,
    recognizedBy: { "@type": "Organization", name: issuer },
    ...(date === null ? {} : { dateCreated: date }),
    ...(verifyHref === null ? {} : { url: verifyHref }),
});

// plain fields go in as they are: toPlainText parses markup and only the rich fields carry it
export const buildProfileJsonLd = (content: Content, siteUrl: URL) => {
    const { locale, seo, hero, profile, education, certifications } = content;
    const url = localeUrl(locale, siteUrl);

    return {
        "@context": SCHEMA_CONTEXT,
        "@type": "ProfilePage",
        url,
        name: seo.title,
        inLanguage: locale,
        dateModified: new Date().toISOString(),
        mainEntity: {
            "@type": "Person",
            // one person behind every language of the page
            "@id": new URL("/#person", siteUrl).href,
            name: profile.name,
            description: seo.description,
            jobTitle: hero.eyebrow,
            url,
            image: new URL(socialImagePath(locale, APP_VERSION), siteUrl).href,
            sameAs: profile.links.map((link) => link.href),
            knowsLanguage: profile.languages.map((language) => language.code),
            address: {
                "@type": "PostalAddress",
                addressLocality: profile.city,
            },
            alumniOf: education.entries.map((entry) => ({
                "@type": "EducationalOrganization",
                name: entry.organisation,
            })),
            hasCredential: certifications.items.map(credential),
        },
    };
};
