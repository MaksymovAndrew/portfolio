export interface Store<T> {
    subscribe(listener: () => void): () => void;
    getSnapshot(): T;
    set(value: T): void;
}

// the shape useSyncExternalStore reads; shared state without a provider
export const createStore = <T>(initial: T): Store<T> => {
    let value = initial;
    const listeners = new Set<() => void>();

    return {
        subscribe: (listener) => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
        getSnapshot: () => value,
        set: (next) => {
            if (Object.is(next, value)) {
                return;
            }

            value = next;
            listeners.forEach((listener) => {
                listener();
            });
        },
    };
};
