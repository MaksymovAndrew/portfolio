import type { Palette } from "types/theme";

export interface MonogramProps {
    initials: string;
    size: number;
    palette: Pick<Palette, "bg" | "line" | "text" | "accent">;
    // a tab shows the shape as drawn; iOS rounds the corners itself and paints transparent ones black
    shape: "rounded" | "square";
}

// the family the image renderer registers the display font under
export const MONOGRAM_FONT = "display";

const FONT_SHARE = 0.32;
const LETTER_SPACING = 0.02;
const CORNER = "22%";
// the smallest icon keeps a visible corner, as drawn in the design
const SMALL_SIZE = 16;
const SMALL_CORNER = 3;

const roundedFrame = (size: number, palette: MonogramProps["palette"]) => ({
    borderRadius: size <= SMALL_SIZE ? SMALL_CORNER : CORNER,
    border: `1px solid ${palette.line}`,
});

// rendered to an image: inline styles only
export const Monogram = ({ initials, size, palette, shape }: MonogramProps) => {
    const fontSize = size * FONT_SHARE;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                background: palette.bg,
                color: palette.text,
                fontFamily: MONOGRAM_FONT,
                fontSize,
                fontWeight: 700,
                letterSpacing: fontSize * LETTER_SPACING,
                lineHeight: 1,
                ...(shape === "rounded" ? roundedFrame(size, palette) : {}),
            }}
        >
            {initials}
            <span style={{ color: palette.accent }}>.</span>
        </div>
    );
};
