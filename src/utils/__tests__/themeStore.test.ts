import { STORAGE_KEYS } from "constants/storage";

import { themeStore } from "utils/themeStore";

const root = document.documentElement;

const themeColor = () =>
    [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) =>
        meta.getAttribute("content"),
    );

describe("themeStore", () => {
    beforeEach(() => {
        // after the first paint only the store changes the theme
        themeStore.set("dark");
        root.style.setProperty("--bg", "#FFFFFF");
        document.head.innerHTML = '<meta name="theme-color" content="#000000">';
    });

    it("should read the theme the pre-paint script set", () => {
        root.dataset.theme = "light";

        expect(themeStore.getSnapshot()).toBe("light");
        expect(themeStore.getServerSnapshot()).toBeNull();
    });

    it("should flip the theme and remember it", () => {
        themeStore.toggle();

        expect(root.dataset.theme).toBe("light");
        expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe("light");
        expect(themeColor()).toEqual(["#FFFFFF"]);
    });

    it("should keep working when storage throws", () => {
        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("storage is blocked");
        });

        themeStore.set("light");

        expect(root.dataset.theme).toBe("light");
    });

    it("should follow a change made in another tab", () => {
        const seen: (string | null)[] = [];
        const unsubscribe = themeStore.subscribe(() =>
            seen.push(themeStore.getSnapshot()),
        );

        window.dispatchEvent(
            new StorageEvent("storage", {
                key: STORAGE_KEYS.theme,
                newValue: "light",
            }),
        );
        unsubscribe();

        expect(root.dataset.theme).toBe("light");
        expect(seen).toEqual(["light"]);
    });

    it("should ignore other keys and unknown themes from another tab", () => {
        const unsubscribe = themeStore.subscribe(() => undefined);

        window.dispatchEvent(
            new StorageEvent("storage", { key: "other", newValue: "light" }),
        );
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: STORAGE_KEYS.theme,
                newValue: "sepia",
            }),
        );
        unsubscribe();

        expect(root.dataset.theme).toBe("dark");
    });

    it("should stop listening to other tabs once nobody subscribes", () => {
        const unsubscribe = themeStore.subscribe(() => undefined);

        unsubscribe();
        window.dispatchEvent(
            new StorageEvent("storage", {
                key: STORAGE_KEYS.theme,
                newValue: "light",
            }),
        );

        expect(root.dataset.theme).toBe("dark");
    });
});
