import { GLYPHS } from "constants/glyphs";
import type { Period } from "types/content";

// a "YYYY-MM" string without an offset is read as UTC, and so is the output
const OPTIONS: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
};

const LETTER = /\p{L}/u;

// some languages add a word for "year" after it ("2024 р."); the site writes the bare year, keeping a mere dot ("2024.")
const withoutYearWord = (
    parts: readonly Intl.DateTimeFormatPart[],
): readonly Intl.DateTimeFormatPart[] => {
    const end = parts.findIndex(({ type }) => type === "year") + 1;
    const suffix = parts.slice(end);
    const isYearWord =
        suffix.every(({ type }) => type === "literal") &&
        suffix.some(({ value }) => LETTER.test(value));

    return isYearWord ? parts.slice(0, end) : parts;
};

export const formatMonth = (month: string, language: string): string =>
    withoutYearWord(
        new Intl.DateTimeFormat(language, OPTIONS).formatToParts(
            new Date(month),
        ),
    )
        .map(({ value }) => value)
        .join("");

export const formatPeriod = (
    { start, end }: Period,
    language: string,
    present: string,
): string =>
    [
        formatMonth(start, language),
        end === null ? present : formatMonth(end, language),
    ].join(` ${GLYPHS.range} `);
