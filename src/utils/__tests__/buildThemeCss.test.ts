import type { Palette, Theme, Tints } from "types/theme";

import { buildThemeCss } from "utils/buildThemeCss";

const palette = (shade: string): Palette => ({
    bg: `#${shade}0001`,
    surface: `#${shade}0002`,
    surface2: `#${shade}0003`,
    line: `#${shade}0004`,
    text: `#${shade}0005`,
    muted: `#${shade}0006`,
    faint: `#${shade}0007`,
    accent: `#${shade}0008`,
    buttonInk: `#${shade}0009`,
    ok: `#${shade}000A`,
    spot: `#${shade}000B`,
    scrim: `#${shade}000C`,
    shadow: `#${shade}000D`,
});

const tints: Tints = {
    soft: 1,
    tagLine: 2,
    liveLine: 3,
    cardLine: 4,
    cardShadow: 5,
    buttonShadow: 6,
    scrim: 7,
    shadow: 8,
    grain: 9,
    glow: 50,
};

const theme: Theme = {
    defaultMode: "light",
    modes: {
        dark: { palette: palette("DD"), tints },
        light: { palette: palette("EE"), tints },
    },
    glow: ["#111111", "#222222"],
    radius: 12,
    social: { mode: "dark" },
};

const DARK = ':root[data-theme="dark"]';

// the declarations of one rule, by its selector
const block = (css: string, selector: string): string => {
    const start = css.indexOf(`${selector}{`);

    return start === -1
        ? ""
        : css.slice(start + selector.length + 1, css.indexOf("}", start));
};

describe("buildThemeCss", () => {
    it("should put the default mode on the root and the other one behind its attribute", () => {
        const css = buildThemeCss(theme);

        expect(block(css, ":root")).toContain("color-scheme:light");
        expect(block(css, ":root")).toContain("--bg:#EE0001");
        expect(block(css, DARK)).toContain("color-scheme:dark");
        expect(block(css, DARK)).toContain("--bg:#DD0001");
    });

    it("should turn every palette colour into its variable", () => {
        const root = block(buildThemeCss(theme), ":root");

        expect(root).toContain("--surface-2:#EE0003");
        expect(root).toContain("--btn-ink:#EE0009");
        expect(root).toContain("--shadow:#EE000D");
        expect(root.split(":#EE00").length - 1).toBe(13);
    });

    it("should write tints as percentages and the layer tints as opacities", () => {
        const root = block(buildThemeCss(theme), ":root");

        expect(root).toContain("--t-soft:1%");
        expect(root).toContain("--t-btn-shadow:6%");
        expect(root).toContain("--grain-o:0.09");
        expect(root).toContain("--glow-o:0.5");
    });

    it("should share the glow, the radius and the soft accent between modes", () => {
        const css = buildThemeCss(theme);

        expect(block(css, ":root")).toContain("--glow-1:#111111");
        expect(block(css, ":root")).toContain("--radius:12px");
        expect(block(css, ":root")).toContain(
            "--accent-soft:color-mix(in srgb,var(--accent) var(--t-soft),transparent)",
        );
        expect(block(css, DARK)).not.toContain("--radius");
    });
});
