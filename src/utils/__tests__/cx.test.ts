import { cx } from "utils/cx";

describe("cx", () => {
    it("should join the class names that apply", () => {
        expect(cx("card", false, "card--live", null, undefined)).toBe(
            "card card--live",
        );
    });

    it("should give an empty string when none applies", () => {
        expect(cx(null, false)).toBe("");
    });
});
