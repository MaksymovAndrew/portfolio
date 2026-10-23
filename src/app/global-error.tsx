"use client";

import "styles/global.scss";

import { theme } from "theme/theme";

import { useTheme } from "hooks/useTheme";

import { ErrorView } from "components/layout/ErrorView";
import { fallbackMessages } from "i18n/fallbackMessages";
import { DEFAULT_LOCALE } from "i18n/locales";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import { FONT_VARIABLES, THEME_CSS } from "app/rootStyles";

interface GlobalErrorProps {
    retry: () => void;
}

// replaces the root layout after an error in it, keeping the theme the page shows; like error.tsx it logs nothing
const GlobalError = ({ retry }: GlobalErrorProps) => {
    const { mode } = useTheme();

    return (
        <html
            lang={DEFAULT_LOCALE}
            data-theme={mode ?? theme.defaultMode}
            className={FONT_VARIABLES}
        >
            <head>
                <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
            </head>
            <body>
                <SystemMessagesProvider value={fallbackMessages}>
                    <ErrorView onRetry={retry} />
                </SystemMessagesProvider>
            </body>
        </html>
    );
};

export default GlobalError;
