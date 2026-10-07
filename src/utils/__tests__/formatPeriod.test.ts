import { formatMonth, formatPeriod } from "utils/formatPeriod";

const PRESENT = "Present";

describe("formatMonth", () => {
    it.each([
        ["en", "Oct 2024"],
        ["pl", "paź 2024"],
        ["uk", "жовт. 2024"],
    ])("should write the month and year in %s", (language, expected) => {
        expect(formatMonth("2024-10", language)).toBe(expected);
    });

    it("should keep what a language writes after the month", () => {
        expect(formatMonth("2024-10", "ja")).toBe("2024年10月");
    });

    it("should keep punctuation that belongs to the year", () => {
        expect(formatMonth("2024-10", "hr")).toBe("lis 2024.");
    });
});

describe("formatPeriod", () => {
    it.each([
        ["en", "Jun 2024 - May 2026"],
        ["pl", "cze 2024 - maj 2026"],
        ["uk", "черв. 2024 - трав. 2026"],
    ])("should write a closed period in %s", (language, expected) => {
        expect(
            formatPeriod(
                { start: "2024-06", end: "2026-05" },
                language,
                PRESENT,
            ),
        ).toBe(expected);
    });

    it("should end an open period with the present word", () => {
        expect(
            formatPeriod({ start: "2024-10", end: null }, "en", PRESENT),
        ).toBe("Oct 2024 - Present");
    });
});
