import { useSyncExternalStore } from "react";

import { useReducedMotion } from "hooks/useReducedMotion";

import { motionStore } from "utils/motionStore";

// paused by the footer button or by the system setting; false on the server
export const useMotionPaused = (): boolean => {
    const paused = useSyncExternalStore(
        motionStore.subscribe,
        motionStore.getSnapshot,
        motionStore.getServerSnapshot,
    );
    const reduced = useReducedMotion();

    return paused || reduced;
};
