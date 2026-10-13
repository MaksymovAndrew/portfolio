import { toHex, toRgb } from "utils/contrast";

const PERCENT = 100;
const CHANNEL_MAX = 255;
const HEX_RADIX = 16;

// the image renderer knows no color-mix(): a theme colour over transparent, written as #RRGGBBAA
export const withAlpha = (hex: string, percent: number): string => {
    const alpha = Math.round((percent / PERCENT) * CHANNEL_MAX)
        .toString(HEX_RADIX)
        .padStart(2, "0")
        .toUpperCase();

    return `${toHex(toRgb(hex))}${alpha}`;
};
