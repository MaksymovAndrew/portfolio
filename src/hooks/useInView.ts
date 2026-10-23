import type { RefObject } from "react";
import { useCallback, useState } from "react";

import { useIntersection } from "hooks/useIntersection";

// whether the element is on screen; an element not drawn (display: none, a hidden column) never is
export const useInView = (): [RefObject<HTMLDivElement | null>, boolean] => {
    const [inView, setInView] = useState(false);
    const onEntry = useCallback((entry: IntersectionObserverEntry) => {
        setInView(entry.isIntersecting);
    }, []);

    return [useIntersection(onEntry), inView];
};
