import type { Palette, ThemeMode } from "types/theme";

import { theme } from "theme/theme";

import { contrastRatio, mixHex } from "utils/contrast";

// WCAG 2.2 AA for normal text
const MIN_CONTRAST = 4.5;

const MODES = ["dark", "light"] as const;

const HEX_COLOUR = /^#[\da-f]{6}$/i;

const TEXT_COLOURS = ["text", "muted", "faint", "accent", "ok"] as const;

// the share of the first glow colour at the centre of the background glow (Atmosphere.module.scss)
const GLOW_CENTRE_PERCENT = 7;

// the project card fades from surface2 at the top to surface at the bottom; its tags never start above 78% of its height
const CARD_UNDER_TAGS_SURFACE_PERCENT = 75;

// every pair of text and background the site paints
const pairsOf = (mode: ThemeMode) => {
    const { palette, tints } = theme.modes[mode];
    const glowCentre = mixHex(
        theme.glow[0],
        palette.bg,
        (GLOW_CENTRE_PERCENT * tints.glow) / 100,
    );
    const cardUnderTags = mixHex(
        palette.surface,
        palette.surface2,
        CARD_UNDER_TAGS_SURFACE_PERCENT,
    );
    const on = (text: keyof Palette, background: string, name: string) => ({
        pair: `${mode}: ${text} on ${name}`,
        ratio: contrastRatio(palette[text], background),
    });

    return [
        ...TEXT_COLOURS.flatMap((text) => [
            on(text, palette.bg, "bg"),
            on(text, palette.surface, "surface"),
            on(text, glowCentre, "the glow centre"),
        ]),
        on("text", palette.surface2, "surface2"),
        // the title of a window bar
        on("faint", palette.surface2, "surface2"),
        // the top of the project card: the live badge, the description, the story link
        on("ok", palette.surface2, "surface2"),
        on("muted", palette.surface2, "surface2"),
        on("accent", palette.surface2, "surface2"),
        on("buttonInk", palette.accent, "accent"),
        // the soft accent fill behind tags and the current language
        on(
            "accent",
            mixHex(palette.accent, palette.bg, tints.soft),
            "the soft accent fill on bg",
        ),
        on(
            "accent",
            mixHex(palette.accent, palette.surface, tints.soft),
            "the soft accent fill on surface",
        ),
        on(
            "accent",
            mixHex(palette.accent, cardUnderTags, tints.soft),
            "the soft accent fill on the project card under its tags",
        ),
        // the current language in the top bar, under the glow
        on(
            "accent",
            mixHex(palette.accent, glowCentre, tints.soft),
            "the soft accent fill on the glow centre",
        ),
    ];
};

describe("theme", () => {
    it("should write every colour as a six-digit hex value", () => {
        const colours = [
            ...MODES.flatMap((mode) =>
                Object.entries(theme.modes[mode].palette).map(
                    ([name, value]) => [`${mode}.${name}`, value],
                ),
            ),
            ...theme.glow.map((value, index) => [`glow ${index + 1}`, value]),
        ];

        // a failure lists every malformed colour by its name
        expect(
            colours.filter(([, value]) => !HEX_COLOUR.test(value ?? "")),
        ).toEqual([]);
    });

    it("should keep every text colour readable in both modes", () => {
        const failing = MODES.flatMap(pairsOf)
            .filter(({ ratio }) => ratio < MIN_CONTRAST)
            .map(({ pair, ratio }) => `${pair}: ${ratio.toFixed(2)}`);

        // a failure lists every pair below the minimum with its ratio
        expect(failing).toEqual([]);
    });
});
