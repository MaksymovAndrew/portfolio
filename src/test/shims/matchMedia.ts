// jsdom has no matchMedia; no query matches unless a test says so, and every test starts with none
const matching = new Set<string>();
const listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();

const listenersOf = (
    media: string,
): Set<EventListenerOrEventListenerObject> => {
    const known =
        listeners.get(media) ?? new Set<EventListenerOrEventListenerObject>();

    listeners.set(media, known);

    return known;
};

const mediaQueryList = (media: string): MediaQueryList => ({
    media,
    get matches() {
        return matching.has(media);
    },
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
    ) => {
        listenersOf(media).add(listener);
    },
    removeEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
    ) => {
        listenersOf(media).delete(listener);
    },
    dispatchEvent: () => false,
});

if (typeof window !== "undefined") {
    Object.assign(window, { matchMedia: mediaQueryList });
}

// a query that starts to match tells the lists that listen to it, as a change of the setting would
export const matchMedia = (media: string): void => {
    matching.add(media);
    listenersOf(media).forEach((listener) => {
        const event = new Event("change");

        if (typeof listener === "function") {
            listener(event);
        } else {
            listener.handleEvent(event);
        }
    });
};

export const resetMedia = (): void => {
    matching.clear();
    listeners.clear();
};
