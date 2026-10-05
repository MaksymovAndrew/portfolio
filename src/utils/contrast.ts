const HEX = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;
const SHORT_HEX_LENGTH = 4;
const CHANNEL_MAX = 255;
const PERCENT = 100;
const HEX_RADIX = 16;

// WCAG 2.2 relative luminance
const LINEAR_THRESHOLD = 0.04045;
const LINEAR_SLOPE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_SCALE = 1.055;
const GAMMA = 2.4;
const RED_WEIGHT = 0.2126;
const GREEN_WEIGHT = 0.7152;
const BLUE_WEIGHT = 0.0722;
const FLARE = 0.05;

type Rgb = readonly [number, number, number];

const toRgb = (hex: string): Rgb => {
    if (!HEX.test(hex)) {
        throw new Error(`Not a hex colour: ${hex}`);
    }

    // "#abc" is "#aabbcc"
    const digits =
        hex.length === SHORT_HEX_LENGTH
            ? hex.slice(1).replace(/./g, "$&$&")
            : hex.slice(1);
    const [red = 0, green = 0, blue = 0] = (digits.match(/../g) ?? []).map(
        (pair) => Number.parseInt(pair, HEX_RADIX),
    );

    return [red, green, blue];
};

const toHex = (rgb: Rgb): string =>
    `#${rgb
        .map((channel) =>
            Math.round(channel).toString(HEX_RADIX).padStart(2, "0"),
        )
        .join("")
        .toUpperCase()}`;

const linear = (channel: number): number => {
    const value = channel / CHANNEL_MAX;

    return value <= LINEAR_THRESHOLD
        ? value / LINEAR_SLOPE
        : ((value + GAMMA_OFFSET) / GAMMA_SCALE) ** GAMMA;
};

const luminance = (hex: string): number => {
    const [red, green, blue] = toRgb(hex);

    return (
        RED_WEIGHT * linear(red) +
        GREEN_WEIGHT * linear(green) +
        BLUE_WEIGHT * linear(blue)
    );
};

export const contrastRatio = (
    foreground: string,
    background: string,
): number => {
    const [first, second] = [luminance(foreground), luminance(background)];

    return (
        (Math.max(first, second) + FLARE) / (Math.min(first, second) + FLARE)
    );
};

// what color-mix(in srgb, color percent%, base) paints
export const mixHex = (
    color: string,
    base: string,
    percent: number,
): string => {
    const share = percent / PERCENT;
    const [top, bottom] = [toRgb(color), toRgb(base)];
    const mix = (index: 0 | 1 | 2) =>
        top[index] * share + bottom[index] * (1 - share);

    return toHex([mix(0), mix(1), mix(2)]);
};
