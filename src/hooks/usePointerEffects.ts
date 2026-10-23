import { useSyncExternalStore } from "react";

import {
    FINE_POINTER_QUERY,
    FORCED_COLORS_QUERY,
    MORE_CONTRAST_QUERY,
    REDUCED_MOTION_QUERY,
} from "constants/motion";

import { matchesMedia, onMediaChange } from "utils/media";

const BLOCKING_QUERIES = [
    REDUCED_MOTION_QUERY,
    FORCED_COLORS_QUERY,
    MORE_CONTRAST_QUERY,
];

const QUERIES = [FINE_POINTER_QUERY, ...BLOCKING_QUERIES];

const subscribe = (listener: () => void): (() => void) =>
    onMediaChange(QUERIES, listener);

const getSnapshot = (): boolean =>
    matchesMedia(FINE_POINTER_QUERY) &&
    !BLOCKING_QUERIES.some((query) => matchesMedia(query));

const getServerSnapshot = (): boolean => false;

// a mouse or a trackpad, and no setting that asks for less motion or the system cursor
export const usePointerEffects = (): boolean =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
