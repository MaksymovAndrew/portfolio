import "styles/global.scss";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getContent } from "i18n/content";
import { isLocale, LOCALES } from "i18n/locales";

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

    const { seo } = getContent(locale);

    return { title: seo.title, description: seo.description };
};

const RootLayout = async ({ children, params }: RootLayoutProps) => {
    const { locale } = await params;

    return (
        <html lang={locale}>
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
