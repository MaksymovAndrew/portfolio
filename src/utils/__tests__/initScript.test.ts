import { applyStoredSettings } from "utils/initScript";

const options = {
    themeKey: "theme",
    motionKey: "motion",
    defaultMode: "dark",
    backgrounds: { dark: "#000000", light: "#FFFFFF" },
} as const;

const themeColor = () =>
    [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) =>
        meta.getAttribute("content"),
    );

describe("applyStoredSettings", () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = options.defaultMode;
        document.documentElement.className = "";
        delete document.documentElement.dataset.motion;
        document.head.innerHTML = "";
    });

    it("should apply a stored theme", () => {
        localStorage.setItem(options.themeKey, "light");

        applyStoredSettings(options);

        expect(document.documentElement.dataset.theme).toBe("light");
        expect(themeColor()).toEqual(["#FFFFFF"]);
    });

    it("should keep the default for an unknown stored value", () => {
        localStorage.setItem(options.themeKey, "sepia");

        applyStoredSettings(options);

        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(themeColor()).toEqual(["#000000"]);
    });

    it("should keep the default when storage throws", () => {
        jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("storage is blocked");
        });

        expect(() => {
            applyStoredSettings(options);
        }).not.toThrow();
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(document.documentElement).not.toHaveAttribute("data-motion");
    });

    it("should leave exactly one theme colour", () => {
        document.head.innerHTML =
            '<meta name="theme-color" content="#123456"><meta name="theme-color" content="#654321">';

        applyStoredSettings(options);

        expect(themeColor()).toEqual(["#000000"]);
    });

    it("should mark the page as running scripts", () => {
        applyStoredSettings(options);

        expect(document.documentElement.classList.contains("js")).toBe(true);
    });

    it("should pause the motion stored as off", () => {
        localStorage.setItem(options.motionKey, "off");

        applyStoredSettings(options);

        expect(document.documentElement.dataset.motion).toBe("off");
    });

    it("should leave the motion running for any other value", () => {
        localStorage.setItem(options.motionKey, "on");

        applyStoredSettings(options);

        expect(document.documentElement).not.toHaveAttribute("data-motion");
    });
});
