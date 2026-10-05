import { applyStoredTheme } from "utils/initScript";

const options = {
    themeKey: "theme",
    defaultMode: "dark",
    backgrounds: { dark: "#000000", light: "#FFFFFF" },
} as const;

const themeColor = () =>
    [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) =>
        meta.getAttribute("content"),
    );

describe("applyStoredTheme", () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = options.defaultMode;
        document.documentElement.className = "";
        document.head.innerHTML = "";
    });

    it("should apply a stored theme", () => {
        localStorage.setItem(options.themeKey, "light");

        applyStoredTheme(options);

        expect(document.documentElement.dataset.theme).toBe("light");
        expect(themeColor()).toEqual(["#FFFFFF"]);
    });

    it("should keep the default for an unknown stored value", () => {
        localStorage.setItem(options.themeKey, "sepia");

        applyStoredTheme(options);

        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(themeColor()).toEqual(["#000000"]);
    });

    it("should keep the default when storage throws", () => {
        jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("storage is blocked");
        });

        expect(() => {
            applyStoredTheme(options);
        }).not.toThrow();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    it("should leave exactly one theme colour", () => {
        document.head.innerHTML =
            '<meta name="theme-color" content="#123456"><meta name="theme-color" content="#654321">';

        applyStoredTheme(options);

        expect(themeColor()).toEqual(["#000000"]);
    });

    it("should mark the page as running scripts", () => {
        applyStoredTheme(options);

        expect(document.documentElement.classList.contains("js")).toBe(true);
    });
});
