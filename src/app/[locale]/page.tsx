import { notFound } from "next/navigation";

import { SITE_URL } from "config/site";

import { Shell } from "components/layout/Shell";
import { Hero } from "components/sections/Hero";
import { pickSections, SECTIONS } from "components/sections/registry";
import { JsonLd } from "components/seo/JsonLd";
import { getContent } from "i18n/content";
import { isLocale } from "i18n/locales";

import { buildProfileJsonLd } from "utils/jsonLd";

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    const content = getContent(locale);

    return (
        <Shell content={content}>
            <JsonLd data={buildProfileJsonLd(content, SITE_URL)} />
            <Hero content={content} />
            {pickSections(content.site.sections, SECTIONS).map(
                ({ id, Component }) => (
                    <Component key={id} content={content} />
                ),
            )}
        </Shell>
    );
};

export default HomePage;
