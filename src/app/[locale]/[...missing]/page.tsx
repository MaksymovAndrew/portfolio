import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NOT_FOUND_SEGMENT } from "constants/routes";

import { NotFoundView } from "components/layout/NotFoundView";
import { getContent } from "i18n/content";
import { isLocale } from "i18n/locales";

interface MissingPageProps {
    params: Promise<{ locale: string }>;
}

// one prebuilt page per language; the proxy rewrites every unknown address here and answers 404
export const generateStaticParams = () => [{ missing: [NOT_FOUND_SEGMENT] }];

export const generateMetadata = async ({
    params,
}: MissingPageProps): Promise<Metadata> => {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    const { ui } = getContent(locale);

    return {
        title: ui.notFound.heading,
        description: ui.notFound.text,
        robots: { index: false },
    };
};

// rendered, not thrown: Next draws a thrown notFound() under the root layout only in the browser
const MissingPage = () => <NotFoundView />;

export default MissingPage;
