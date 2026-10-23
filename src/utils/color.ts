const HEX = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;
const SHORT_HEX_LENGTH = 4;
const HEX_RADIX = 16;

type Rgb = readonly [number, number, number];

export const toRgb = (hex: string): Rgb => {
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

export const toHex = (rgb: Rgb): string =>
    `#${rgb
        .map((channel) =>
            Math.round(channel).toString(HEX_RADIX).padStart(2, "0"),
        )
        .join("")
        .toUpperCase()}`;
