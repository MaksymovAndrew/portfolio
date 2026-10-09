// jsdom has no matchMedia; no query matches unless a test says so, and every test starts with none
const matching = new Set<string>();

const mediaQueryList = (media: string): MediaQueryList => ({
    media,
    matches: matching.has(media),
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
});

if (typeof window !== "undefined") {
    Object.assign(window, { matchMedia: mediaQueryList });
}

export const matchMedia = (media: string): void => {
    matching.add(media);
};

export const resetMedia = (): void => {
    matching.clear();
};
