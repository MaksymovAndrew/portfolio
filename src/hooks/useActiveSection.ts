import { useCallback, useSyncExternalStore } from "react";

import type { SectionId } from "types/content";

import { activeSectionStore } from "utils/activeSectionStore";

// which of the given sections is being read; null on the server and until one first crosses the band
export const useActiveSection = (
    ids: readonly SectionId[],
): SectionId | null => {
    const subscribe = useCallback(
        (listener: () => void) => activeSectionStore.subscribe(listener, ids),
        [ids],
    );

    return useSyncExternalStore(
        subscribe,
        activeSectionStore.getSnapshot,
        activeSectionStore.getServerSnapshot,
    );
};
