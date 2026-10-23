import { useCallback, useMemo, useSyncExternalStore } from "react";

import { CLOCK_TICK_MS } from "constants/timing";

const getServerSnapshot = (): null => null;

const subscribe = (listener: () => void): (() => void) => {
    const timer = setInterval(listener, CLOCK_TICK_MS);

    return () => {
        clearInterval(timer);
    };
};

// a 24-hour "14:32" whatever the page's language
const CLOCK_LOCALE = "en-GB";

// "14:32" in the given zone; null on the server and while hydrating, so the markup always matches
export const useClock = (timeZone: string): string | null => {
    const formatter = useMemo(
        () =>
            new Intl.DateTimeFormat(CLOCK_LOCALE, {
                hour: "2-digit",
                minute: "2-digit",
                timeZone,
            }),
        [timeZone],
    );
    const getSnapshot = useCallback(
        () => formatter.format(new Date()),
        [formatter],
    );

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
