export interface Signal {
    subscribe: (listener: () => void) => () => void;
    notify: () => void;
}

// what a signal listens to while anyone subscribes, and how to stop
export type Start = () => () => void;

// the first listener starts the source, the last one to leave stops it
export const createSignal = (start?: Start): Signal => {
    const listeners = new Set<() => void>();
    let stop: (() => void) | undefined;

    return {
        subscribe: (listener) => {
            if (listeners.size === 0) {
                stop = start?.();
            }

            listeners.add(listener);

            return () => {
                listeners.delete(listener);

                if (listeners.size === 0) {
                    stop?.();
                    stop = undefined;
                }
            };
        },
        notify: () => {
            listeners.forEach((listener) => {
                listener();
            });
        },
    };
};
