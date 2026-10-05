import type { Palette, Theme, ThemeMode, Tints } from "types/theme";

const PALETTE_VARIABLES: Readonly<Record<keyof Palette, string>> = {
    bg: "--bg",
    surface: "--surface",
    surface2: "--surface-2",
    line: "--line",
    text: "--text",
    muted: "--muted",
    faint: "--faint",
    accent: "--accent",
    buttonInk: "--btn-ink",
    ok: "--ok",
    spot: "--spot",
    scrim: "--scrim",
    shadow: "--shadow",
};

// a mix share becomes a percentage, the opacity of a layer a fraction
const TINT_VARIABLES: Readonly<
    Record<keyof Tints, { name: string; unit: "%" | "opacity" }>
> = {
    soft: { name: "--t-soft", unit: "%" },
    tagLine: { name: "--t-tag-line", unit: "%" },
    liveLine: { name: "--t-live-line", unit: "%" },
    cardLine: { name: "--t-card-line", unit: "%" },
    cardShadow: { name: "--t-card-shadow", unit: "%" },
    buttonShadow: { name: "--t-btn-shadow", unit: "%" },
    scrim: { name: "--t-scrim", unit: "%" },
    shadow: { name: "--t-shadow", unit: "%" },
    grain: { name: "--grain-o", unit: "opacity" },
    glow: { name: "--glow-o", unit: "opacity" },
};

const PERCENT = 100;

const ACCENT_SOFT =
    "color-mix(in srgb,var(--accent) var(--t-soft),transparent)";

// Object.keys types its result as string[]; these records have exactly the keys of their type
const keysOf = <T extends object>(record: T) =>
    Object.keys(record) as (keyof T)[];

const declarations = (entries: readonly (readonly [string, string])[]) =>
    entries.map(([name, value]) => `${name}:${value}`).join(";");

const modeDeclarations = (theme: Theme, mode: ThemeMode): string => {
    const { palette, tints } = theme.modes[mode];
    const colours = keysOf(PALETTE_VARIABLES).map(
        (key) => [PALETTE_VARIABLES[key], palette[key]] as const,
    );
    const shares = keysOf(TINT_VARIABLES).map((key) => {
        const { name, unit } = TINT_VARIABLES[key];

        return [
            name,
            unit === "%" ? `${tints[key]}%` : String(tints[key] / PERCENT),
        ] as const;
    });

    return declarations([["color-scheme", mode], ...colours, ...shares]);
};

// the CSS variables of both modes: the default one on :root, the other behind its data-theme
export const buildThemeCss = (theme: Theme): string => {
    const shared = declarations([
        ["--glow-1", theme.glow[0]],
        ["--glow-2", theme.glow[1]],
        ["--radius", `${theme.radius}px`],
        ["--accent-soft", ACCENT_SOFT],
    ]);
    const others = keysOf(theme.modes)
        .filter((mode) => mode !== theme.defaultMode)
        .map(
            (mode) =>
                `:root[data-theme="${mode}"]{${modeDeclarations(theme, mode)}}`,
        );

    return [
        `:root{${modeDeclarations(theme, theme.defaultMode)};${shared}}`,
        ...others,
    ].join("");
};
