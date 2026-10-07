import { placeholderLabel } from "utils/placeholderLabel";

describe("placeholderLabel", () => {
    it("should keep the last part of a name written as a path", () => {
        expect(placeholderLabel("example-app / settings")).toBe("settings");
    });

    it("should write dashes and underscores as spaces", () => {
        expect(placeholderLabel("example-app / home-screen_2")).toBe(
            "home screen 2",
        );
    });

    it("should keep a name without a path", () => {
        expect(placeholderLabel("settings")).toBe("settings");
    });

    it("should keep the whole name when its last part is empty", () => {
        expect(placeholderLabel("settings /")).toBe("settings /");
    });
});
