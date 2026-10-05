import "styles/global.scss";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getContent } from "i18n/content";
import { isLocale, LOCALES } from "i18n/locales";
import { localePath } from "i18n/paths";
import { SystemMessagesProvider } from "i18n/SystemMessages";

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

    if (!isLocale(locale)) {
        notFound();
    }

    const { ui } = getContent(locale);
    const systemMessages = {
        homeHref: localePath(locale),
        home: ui.home,
        notFound: ui.notFound,
        error: ui.error,
    };

    return (
        <html lang={locale}>
            <body>
                <SystemMessagesProvider value={systemMessages}>
                    {children}
                </SystemMessagesProvider>
            </body>
        </html>
    );
};

export default RootLayout;
