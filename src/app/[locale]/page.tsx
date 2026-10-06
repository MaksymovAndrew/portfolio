import { notFound } from "next/navigation";

import { Identity } from "components/layout/Identity";
import { Shell } from "components/layout/Shell";
import { pickSections, SECTIONS } from "components/sections/registry";
import { getContent } from "i18n/content";
import { isLocale } from "i18n/locales";

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    const content = getContent(locale);
    const { hero, profile, site, ui } = content;

    return (
        <Shell content={content}>
            <Identity
                place="hero"
                eyebrow={hero.eyebrow}
                name={profile.name}
                tagline={hero.tagline}
                externalHint={ui.external}
            />
            <p>{hero.sub}</p>
            {pickSections(site.sections, SECTIONS).map(({ id, Component }) => (
                <Component key={id} content={content} />
            ))}
        </Shell>
    );
};

export default HomePage;
