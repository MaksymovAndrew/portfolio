// jsdom has no Clipboard API; a test takes it away as an insecure page or an old browser would, and every test starts with it back
const clipboard = {
    writeText: (): Promise<void> => Promise.resolve(),
};

let available = true;

if (typeof navigator !== "undefined") {
    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        get: () => (available ? clipboard : undefined),
    });
}

export const removeClipboard = (): void => {
    available = false;
};

export const restoreClipboard = (): void => {
    available = true;
};
