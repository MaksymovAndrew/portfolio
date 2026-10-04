import "styles/global.scss";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { APP_NAME } from "config/app";

import { LOCALES } from "i18n/locales";

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

// a language outside the list answers 404 instead of rendering on demand
export const dynamicParams = false;

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const metadata: Metadata = { title: APP_NAME };

const RootLayout = async ({ children, params }: RootLayoutProps) => {
    const { locale } = await params;

    return (
        <html lang={locale}>
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
