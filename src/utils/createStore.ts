import type { Start } from "utils/signal";
import { createSignal } from "utils/signal";

export interface Store<T> {
    subscribe: (listener: () => void) => () => void;
    getSnapshot: () => T;
    set: (value: T) => void;
}

// the shape useSyncExternalStore reads; shared state without a provider
export const createStore = <T>(initial: T, start?: Start): Store<T> => {
    let value = initial;
    const signal = createSignal(start);

    return {
        subscribe: signal.subscribe,
        getSnapshot: () => value,
        set: (next) => {
            if (Object.is(next, value)) {
                return;
            }

            value = next;
            signal.notify();
        },
    };
};
