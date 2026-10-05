import { notFound } from "next/navigation";

import { ThemeToggle } from "components/controls/ThemeToggle";
import { RichText } from "components/ui/RichText";
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

    const { hero, profile, ui } = getContent(locale);

    return (
        <main>
            <h1>{profile.name}</h1>
            <p>
                <RichText text={hero.tagline} externalHint={ui.external} />
            </p>
            <p>{hero.sub}</p>
            <ThemeToggle label={ui.theme} />
        </main>
    );
};

export default HomePage;
