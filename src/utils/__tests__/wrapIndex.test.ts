import { wrapIndex } from "utils/wrapIndex";

describe("wrapIndex", () => {
    it("should step forward", () => {
        expect(wrapIndex(0, 1, 3)).toBe(1);
    });

    it("should wrap forward past the end to the start", () => {
        expect(wrapIndex(2, 1, 3)).toBe(0);
    });

    it("should wrap back past the start to the end", () => {
        expect(wrapIndex(0, -1, 3)).toBe(2);
    });

    it("should stay on a single item", () => {
        expect(wrapIndex(0, 1, 1)).toBe(0);
        expect(wrapIndex(0, -1, 1)).toBe(0);
    });
});
