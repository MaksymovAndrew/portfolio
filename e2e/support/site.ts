import { DEFAULT_LOCALE, LOCALES } from "content/locales";
import { theme } from "theme/theme";

import type { Locale } from "i18n/locales";
import { localePath } from "i18n/paths";

export { DEFAULT_LOCALE, LOCALES } from "content/locales";

export const WIDTHS = [320, 375, 768, 1024, 1280, 1440] as const;

export const THEMES = ["dark", "light"] as const;

export const VIEWPORT_HEIGHT = 900;

export const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
export const PHONE = { width: 375, height: VIEWPORT_HEIGHT };

export const OTHER_LOCALES = LOCALES.filter(
    (locale) => locale !== DEFAULT_LOCALE,
);

export const OTHER_MODE =
    THEMES.find((mode) => mode !== theme.defaultMode) ?? theme.defaultMode;

export { localePath };

// an address that exists in no language: "/no-such-page", "/pl/no-such-page"
export const missingPathFor = (locale: Locale): string =>
    `${localePath(locale).replace(/\/$/, "")}/no-such-page`;
