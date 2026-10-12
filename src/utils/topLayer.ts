const listeners = new Set<() => void>();

// a modal dialog joins the top layer above everything opened before it; what must stay above listens and opens again
export const topLayer = {
    notify: (): void => {
        listeners.forEach((listener) => {
            listener();
        });
    },
    subscribe: (listener: () => void): (() => void) => {
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    },
};
