export type ThemeMode = "dark" | "light";

export interface Palette {
    bg: string;
    surface: string;
    surface2: string;
    line: string;
    text: string;
    muted: string;
    faint: string;
    accent: string;
    buttonInk: string;
    ok: string;
    spot: string;
    scrim: string;
    shadow: string;
}

// percent: how much of a colour a mix takes; grainOpacity and glowOpacity are the opacity of their layer
export interface Tints {
    soft: number;
    tagLine: number;
    liveLine: number;
    cardLine: number;
    cardShadow: number;
    buttonShadow: number;
    selection: number;
    scrollbar: number;
    scrim: number;
    shadow: number;
    row: number;
    rowOk: number;
    glass: number;
    bar: number;
    glare: number;
    spot: number;
    ring: number;
    dotGlow: number;
    stripe: number;
    grainOpacity: number;
    glowOpacity: number;
}

export interface Theme {
    defaultMode: ThemeMode;
    modes: Readonly<Record<ThemeMode, { palette: Palette; tints: Tints }>>;
    glow: readonly [string, string];
    radius: number;
    social: { mode: ThemeMode };
}
