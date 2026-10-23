import type { RefObject } from "react";
import { useCallback } from "react";

import { useIntersection } from "hooks/useIntersection";

// an empty marker on the page reports whether the window has scrolled past it; no scroll listener runs
export const useScrolledPast = (
    onChange: (past: boolean) => void,
): RefObject<HTMLDivElement | null> => {
    const onEntry = useCallback(
        (entry: IntersectionObserverEntry) => {
            onChange(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        },
        [onChange],
    );

    return useIntersection(onEntry);
};
