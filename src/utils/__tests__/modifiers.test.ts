import { hasModifier } from "utils/modifiers";

const NONE = { altKey: false, ctrlKey: false, metaKey: false };

describe("hasModifier", () => {
    it("should see Alt, Ctrl and Cmd", () => {
        expect(hasModifier({ ...NONE, altKey: true })).toBe(true);
        expect(hasModifier({ ...NONE, ctrlKey: true })).toBe(true);
        expect(hasModifier({ ...NONE, metaKey: true })).toBe(true);
    });

    it("should see nothing without them", () => {
        expect(hasModifier(NONE)).toBe(false);
    });
});
