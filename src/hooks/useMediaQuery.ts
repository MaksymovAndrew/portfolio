import { useCallback, useSyncExternalStore } from "react";

import { matchesMedia, onMediaChange } from "utils/media";

// follows the query while the page is open; false on the server
export const useMediaQuery = (query: string): boolean => {
    const subscribe = useCallback(
        (listener: () => void) => onMediaChange([query], listener),
        [query],
    );

    return useSyncExternalStore(
        subscribe,
        () => matchesMedia(query),
        () => false,
    );
};
