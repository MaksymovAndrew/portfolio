import type { CSSProperties } from "react";

import { SOCIAL_IMAGE } from "constants/social";
import type { Palette, Tints } from "types/theme";

import { MONOGRAM_FONT } from "components/social/Monogram";

import { withAlpha } from "utils/withAlpha";

// the families the image renderer registers the three fonts under
export const SOCIAL_FONTS = {
    display: MONOGRAM_FONT,
    body: "body",
    mono: "mono",
} as const;

const PERCENT = 100;

// the site's glow in the corner of the card; the renderer clips a layer pushed past the edge, so it is the card's own background
const GLOW = { x: 1000, y: 70, radius: 636, first: 13, second: 6 };
const DOT_GLOW = 70;

const glowGradient = (
    [first, second]: readonly [string, string],
    strength: number,
) => {
    const share = strength / PERCENT;

    return `radial-gradient(circle ${GLOW.radius}px at ${GLOW.x}px ${GLOW.y}px, ${withAlpha(first, GLOW.first * share)} 0%, ${withAlpha(second, GLOW.second * share)} 35%, transparent 65%)`;
};

// letter spacing in em at the card's font sizes, as the renderer wants pixels
const EYEBROW = { size: 22, spacing: 0.04 };
const NAME = { size: 88, spacing: -0.015 };
const LOGO = { size: 28, spacing: 0.06 };
const letterSpacing = ({ size, spacing }: { size: number; spacing: number }) =>
    size * spacing;

export const cardStyles = (
    palette: Palette,
    tints: Tints,
    glow: readonly [string, string],
) =>
    ({
        card: {
            display: "flex",
            flexDirection: "column",
            width: SOCIAL_IMAGE.width,
            height: SOCIAL_IMAGE.height,
            padding: "64px 76px 58px",
            backgroundColor: palette.bg,
            backgroundImage: glowGradient(glow, tints.glow),
            color: palette.text,
            fontFamily: SOCIAL_FONTS.body,
        },
        eyebrow: {
            color: palette.accent,
            fontFamily: SOCIAL_FONTS.mono,
            fontSize: EYEBROW.size,
            lineHeight: 1.4,
            letterSpacing: letterSpacing(EYEBROW),
        },
        name: {
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            fontFamily: SOCIAL_FONTS.display,
            fontSize: NAME.size,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: letterSpacing(NAME),
        },
        tagline: {
            display: "flex",
            flexWrap: "wrap",
            columnGap: 8,
            maxWidth: 920,
            marginTop: 30,
            fontSize: 33,
            fontWeight: 600,
            lineHeight: 1.35,
        },
        word: { display: "flex" },
        accent: { color: palette.accent },
        foot: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginTop: "auto",
        },
        chips: { display: "flex", gap: 14 },
        chip: {
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "10px 20px",
            border: `1px solid ${palette.line}`,
            borderRadius: 99,
            background: palette.surface,
            color: palette.muted,
            fontFamily: SOCIAL_FONTS.mono,
            fontSize: 19,
        },
        dot: {
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: palette.ok,
            boxShadow: `0 0 8px ${withAlpha(palette.ok, DOT_GLOW)}`,
        },
        logo: {
            display: "flex",
            fontFamily: SOCIAL_FONTS.display,
            fontSize: LOGO.size,
            fontWeight: 700,
            letterSpacing: letterSpacing(LOGO),
        },
    }) satisfies Record<string, CSSProperties>;
