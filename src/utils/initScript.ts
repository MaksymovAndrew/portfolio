import type { ThemeMode } from "types/theme";

export interface InitScriptOptions {
    themeKey: string;
    defaultMode: ThemeMode;
    backgrounds: Readonly<Record<ThemeMode, string>>;
}

// runs inline before the first paint as its own source text, so it may use nothing from outside itself
export const applyStoredTheme = ({
    themeKey,
    defaultMode,
    backgrounds,
}: InitScriptOptions): void => {
    const root = document.documentElement;
    const isMode = (value: string | null): value is ThemeMode =>
        value !== null && Object.hasOwn(backgrounds, value);
    const readStored = (): ThemeMode => {
        try {
            const stored = localStorage.getItem(themeKey);

            return isMode(stored) ? stored : defaultMode;
        } catch {
            return defaultMode;
        }
    };
    const mode = readStored();

    root.dataset.theme = mode;

    // the only theme-color tag with scripts on; iOS Safari ignores a changed one, so it is replaced
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
        meta.remove();
    }

    const meta = document.createElement("meta");

    meta.name = "theme-color";
    meta.content = backgrounds[mode];
    document.head.append(meta);
    root.classList.add("js");
};

export const buildInitScript = (options: InitScriptOptions): string =>
    `(${applyStoredTheme.toString()})(${JSON.stringify(options)})`;
