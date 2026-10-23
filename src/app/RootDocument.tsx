import "styles/global.scss";

import type { ReactNode } from "react";

import { STORAGE_KEYS } from "constants/storage";

import { theme } from "theme/theme";

import { PointerEffects } from "components/effects/PointerEffects";
import { TopBar } from "components/layout/TopBar";
import { getContent } from "i18n/content";
import type { Locale } from "i18n/locales";
import { localePath } from "i18n/paths";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import { buildInitScript } from "utils/initScript";

import { FONT_VARIABLES, THEME_CSS } from "app/rootStyles";

interface RootDocumentProps {
    locale: Locale;
    children: ReactNode;
}

const DEFAULT_BACKGROUND = theme.modes[theme.defaultMode].palette.bg;

const INIT_SCRIPT = buildInitScript({
    themeKey: STORAGE_KEYS.theme,
    motionKey: STORAGE_KEYS.motion,
    defaultMode: theme.defaultMode,
    backgrounds: {
        dark: theme.modes.dark.palette.bg,
        light: theme.modes.light.palette.bg,
    },
});

// the root layout's and the global 404 page's document; suppressHydrationWarning: the pre-paint script sets data-theme, data-motion and the js class first
export const RootDocument = ({ locale, children }: RootDocumentProps) => {
    const content = getContent(locale);
    const { ui } = content;
    const systemMessages = {
        homeHref: localePath(locale),
        home: ui.home,
        notFound: ui.notFound,
        error: ui.error,
        topBar: <TopBar content={content} variant="system" />,
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
                <PointerEffects />
            </body>
        </html>
    );
};
