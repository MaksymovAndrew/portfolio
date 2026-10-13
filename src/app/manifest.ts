import type { MetadataRoute } from "next";

import { ICON_SIZES } from "constants/icons";

import { theme } from "theme/theme";

import { getContent } from "i18n/content";
import { DEFAULT_LOCALE } from "i18n/locales";

// one manifest for the whole site, in the default language and the default theme
const manifest = (): MetadataRoute.Manifest => {
    const { profile, seo } = getContent(DEFAULT_LOCALE);
    const { bg } = theme.modes[theme.defaultMode].palette;

    return {
        name: profile.name,
        short_name: profile.initials,
        description: seo.description,
        lang: DEFAULT_LOCALE,
        id: "/",
        start_url: "/",
        display: "standalone",
        background_color: bg,
        theme_color: bg,
        icons: ICON_SIZES.app.map((size) => ({
            src: `/icon/${String(size)}`,
            sizes: `${String(size)}x${String(size)}`,
            type: "image/png",
        })),
    };
};

export default manifest;
