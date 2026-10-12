import { useSyncExternalStore } from "react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

const subscribe = (listener: () => void): (() => void) => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);

    query.addEventListener("change", listener);

    return () => {
        query.removeEventListener("change", listener);
    };
};

const getSnapshot = (): boolean =>
    window.matchMedia(REDUCED_MOTION_QUERY).matches;

const getServerSnapshot = (): boolean => false;

// follows the system setting while the page is open
export const useReducedMotion = (): boolean =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
