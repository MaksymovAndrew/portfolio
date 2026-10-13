import { theme } from "theme/theme";

import { getContent } from "i18n/content";
import { DEFAULT_LOCALE } from "i18n/locales";

import manifest from "app/manifest";

describe("manifest", () => {
    it("should name the site after the person of the default language", () => {
        const { profile, seo } = getContent(DEFAULT_LOCALE);

        expect(manifest()).toMatchObject({
            name: profile.name,
            short_name: profile.initials,
            description: seo.description,
            start_url: "/",
        });
    });

    it("should paint the window in the background of the default theme", () => {
        const { bg } = theme.modes[theme.defaultMode].palette;

        expect(manifest()).toMatchObject({
            background_color: bg,
            theme_color: bg,
        });
    });

    it("should offer the icons a home screen needs", () => {
        expect(manifest().icons?.map((icon) => icon.sizes)).toEqual([
            "192x192",
            "512x512",
        ]);
    });
});
