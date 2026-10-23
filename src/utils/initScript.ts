import type { ThemeMode } from "types/theme";

interface InitScriptOptions {
    themeKey: string;
    motionKey: string;
    defaultMode: ThemeMode;
    backgrounds: Readonly<Record<ThemeMode, string>>;
}

// runs inline before the first paint as its own source text, so it may use nothing from outside itself
export const applyStoredSettings = ({
    themeKey,
    motionKey,
    defaultMode,
    backgrounds,
}: InitScriptOptions): void => {
    const root = document.documentElement;
    const isMode = (value: string | null): value is ThemeMode =>
        value !== null && Object.hasOwn(backgrounds, value);
    const readStored = (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    };
    const stored = readStored(themeKey);
    const mode = isMode(stored) ? stored : defaultMode;

    root.dataset.theme = mode;

    if (readStored(motionKey) === "off") {
        root.dataset.motion = "off";
    }

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
    `(${applyStoredSettings.toString()})(${JSON.stringify(options)})`;
