import { useCallback, useMemo, useSyncExternalStore } from "react";

import { CLOCK_TICK_MS } from "constants/timing";

const getServerSnapshot = (): null => null;

const subscribe = (listener: () => void): (() => void) => {
    const timer = setInterval(listener, CLOCK_TICK_MS);

    return () => {
        clearInterval(timer);
    };
};

// "14:32" in the given zone; null on the server and while hydrating, so the markup always matches
export const useClock = (timeZone: string): string | null => {
    const format = useMemo(
        () =>
            new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone,
            }),
        [timeZone],
    );
    const getSnapshot = useCallback(() => format.format(new Date()), [format]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
