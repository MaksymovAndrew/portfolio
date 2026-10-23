import type { RefObject } from "react";
import { useEffect, useRef } from "react";

// every change of the element's place against the window reaches onEntry
export const useIntersection = (
    onEntry: (entry: IntersectionObserverEntry) => void,
): RefObject<HTMLDivElement | null> => {
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = element.current;

        if (!target) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                onEntry(entry);
            });
        });

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [onEntry]);

    return element;
};
