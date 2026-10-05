import type { Palette, ThemeMode } from "types/theme";

import { theme } from "theme/theme";

import { contrastRatio, mixHex } from "utils/contrast";

// WCAG 2.2 AA for normal text
const MIN_CONTRAST = 4.5;

const MODES = ["dark", "light"] as const;

const HEX_COLOUR = /^#[\da-f]{6}$/i;

const TEXT_COLOURS = ["text", "muted", "faint", "accent", "ok"] as const;

// every pair of text and background the site paints
const pairsOf = (mode: ThemeMode) => {
    const { palette, tints } = theme.modes[mode];
    const on = (text: keyof Palette, background: string, name: string) => ({
        pair: `${mode}: ${text} on ${name}`,
        ratio: contrastRatio(palette[text], background),
    });

    return [
        ...TEXT_COLOURS.flatMap((text) => [
            on(text, palette.bg, "bg"),
            on(text, palette.surface, "surface"),
        ]),
        on("text", palette.surface2, "surface2"),
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
