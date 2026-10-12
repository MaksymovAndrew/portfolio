import { useSyncExternalStore } from "react";

import {
    FINE_POINTER_QUERY,
    FORCED_COLORS_QUERY,
    MORE_CONTRAST_QUERY,
    REDUCED_MOTION_QUERY,
} from "constants/motion";

const BLOCKING_QUERIES = [
    REDUCED_MOTION_QUERY,
    FORCED_COLORS_QUERY,
    MORE_CONTRAST_QUERY,
];

const QUERIES = [FINE_POINTER_QUERY, ...BLOCKING_QUERIES];

const subscribe = (listener: () => void): (() => void) => {
    const lists = QUERIES.map((query) => window.matchMedia(query));

    lists.forEach((list) => {
        list.addEventListener("change", listener);
    });

    return () => {
        lists.forEach((list) => {
            list.removeEventListener("change", listener);
        });
    };
};

const getSnapshot = (): boolean =>
    window.matchMedia(FINE_POINTER_QUERY).matches &&
    !BLOCKING_QUERIES.some((query) => window.matchMedia(query).matches);

const getServerSnapshot = (): boolean => false;

// a mouse or a trackpad, and no setting that asks for less motion or the system cursor
export const usePointerEffects = (): boolean =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
