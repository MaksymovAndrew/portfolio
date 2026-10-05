import { contrastRatio, mixHex } from "utils/contrast";

// to two decimals, as WCAG states ratios
const rounded = (ratio: number) => Math.round(ratio * 100) / 100;

describe("contrastRatio", () => {
    it("should give black on white the highest ratio", () => {
        expect(rounded(contrastRatio("#000000", "#FFFFFF"))).toBe(21);
    });

    it("should give a colour on itself a ratio of one", () => {
        expect(contrastRatio("#6FC7FF", "#6FC7FF")).toBe(1);
    });

    it("should not depend on which colour is the text", () => {
        expect(contrastRatio("#0B66B5", "#F5F7FA")).toBe(
            contrastRatio("#F5F7FA", "#0B66B5"),
        );
    });

    it("should read the short hex form", () => {
        expect(rounded(contrastRatio("#fff", "#000"))).toBe(21);
    });

    it("should refuse a value that is not a hex colour", () => {
        expect(() => contrastRatio("tomato", "#000000")).toThrow("tomato");
    });
});

describe("mixHex", () => {
    it("should give the base at zero and the colour at one hundred", () => {
        expect(mixHex("#6FC7FF", "#11151E", 0)).toBe("#11151E");
        expect(mixHex("#6FC7FF", "#11151E", 100)).toBe("#6FC7FF");
    });

    it("should mix the channels in proportion", () => {
        expect(mixHex("#000000", "#FFFFFF", 50)).toBe("#808080");
    });
});
