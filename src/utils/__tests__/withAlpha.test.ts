import { withAlpha } from "utils/withAlpha";

describe("withAlpha", () => {
    it("should keep the channels and turn the percent into opacity", () => {
        expect(withAlpha("#6FC7FF", 13)).toBe("#6FC7FF21");
    });

    it("should read the short form of a colour", () => {
        expect(withAlpha("#fff", 50)).toBe("#FFFFFF80");
    });

    it("should refuse a value that is not a hex colour", () => {
        expect(() => withAlpha("red", 50)).toThrow("Not a hex colour: red");
    });
});
