import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SITE_URL } from "config/site";

import { getContent } from "i18n/content";
import { isLocale, LOCALES } from "i18n/locales";

import { buildMetadata } from "utils/metadata";

import { RootDocument } from "app/RootDocument";

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

// a language outside the list answers 404 instead of rendering on demand
export const dynamicParams = false;

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const generateMetadata = async ({
    params,
}: Pick<RootLayoutProps, "params">): Promise<Metadata> => {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    return buildMetadata(getContent(locale), SITE_URL);
};

// no themeColor here: hydration would put the tag back next to the one the pre-paint script wrote
export const viewport: Viewport = { viewportFit: "cover" };

const RootLayout = async ({ children, params }: RootLayoutProps) => {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    return <RootDocument locale={locale}>{children}</RootDocument>;
};

export default RootLayout;
