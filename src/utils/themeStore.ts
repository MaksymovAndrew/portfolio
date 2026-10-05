import { STORAGE_KEYS } from "constants/storage";
import type { ThemeMode } from "types/theme";

import { createStore } from "utils/createStore";
import { writeStorage } from "utils/storage";

const isThemeMode = (value: string | null | undefined): value is ThemeMode =>
    value === "dark" || value === "light";

const store = createStore<ThemeMode | null>(null);
let subscribers = 0;

// the pre-paint script and the server both set it, so the page itself holds the theme
const readTheme = (): ThemeMode | null => {
    const { theme } = document.documentElement.dataset;

    return isThemeMode(theme) ? theme : null;
};

// iOS Safari ignores a changed theme-color, so the tag is replaced
const replaceThemeColor = (color: string) => {
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
        meta.remove();
    }

    const meta = document.createElement("meta");

    meta.name = "theme-color";
    meta.content = color;
    document.head.append(meta);
};

const apply = (mode: ThemeMode) => {
    const root = document.documentElement;

    root.dataset.theme = mode;
    // the colours live in the CSS the theme wrote, so this file never reads theme/
    replaceThemeColor(getComputedStyle(root).getPropertyValue("--bg").trim());
    store.set(mode);
};

const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.theme && isThemeMode(event.newValue)) {
        apply(event.newValue);
    }
};

export const themeStore = {
    subscribe: (listener: () => void): (() => void) => {
        const unsubscribe = store.subscribe(listener);

        if (subscribers === 0) {
            window.addEventListener("storage", onStorage);
        }

        subscribers += 1;

        return () => {
            unsubscribe();
            subscribers -= 1;

            if (subscribers === 0) {
                window.removeEventListener("storage", onStorage);
            }
        };
    },
    getSnapshot: readTheme,
    getServerSnapshot: (): null => null,
    set: (mode: ThemeMode): void => {
        writeStorage(STORAGE_KEYS.theme, mode);
        apply(mode);
    },
    toggle: (): void => {
        themeStore.set(readTheme() === "light" ? "dark" : "light");
    },
};
