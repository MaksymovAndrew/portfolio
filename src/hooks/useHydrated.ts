import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => undefined;

// false on the server and while hydrating, true once the island runs
export const useHydrated = (): boolean =>
    useSyncExternalStore(
        subscribeToNothing,
        () => true,
        () => false,
    );
