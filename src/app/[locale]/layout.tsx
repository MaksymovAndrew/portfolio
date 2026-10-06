import "styles/global.scss";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { STORAGE_KEYS } from "constants/storage";

import { body, display, mono } from "theme/fonts";
import { theme } from "theme/theme";

import { getContent } from "i18n/content";
import { isLocale, LOCALES } from "i18n/locales";
import { localePath } from "i18n/paths";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import { buildThemeCss } from "utils/buildThemeCss";
import { buildInitScript } from "utils/initScript";

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

const THEME_CSS = buildThemeCss(theme);

const DEFAULT_BACKGROUND = theme.modes[theme.defaultMode].palette.bg;

const INIT_SCRIPT = buildInitScript({
    themeKey: STORAGE_KEYS.theme,
    defaultMode: theme.defaultMode,
    backgrounds: {
        dark: theme.modes.dark.palette.bg,
        light: theme.modes.light.palette.bg,
    },
});

const FONT_VARIABLES = [display.variable, body.variable, mono.variable].join(
    " ",
);

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

// no themeColor here: hydration would put the tag back next to the one the pre-paint script wrote
export const viewport: Viewport = { viewportFit: "cover" };

// suppressHydrationWarning: the pre-paint script sets data-theme and the js class before React hydrates; safe while these props never change on the client, so React never rewrites them
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
        <html
            lang={locale}
            data-theme={theme.defaultMode}
            className={FONT_VARIABLES}
            suppressHydrationWarning
        >
            <head>
                <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
                <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
                <noscript>
                    <meta name="theme-color" content={DEFAULT_BACKGROUND} />
                </noscript>
            </head>
            <body>
                <SystemMessagesProvider value={systemMessages}>
                    {children}
                </SystemMessagesProvider>
            </body>
        </html>
    );
};

export default RootLayout;
