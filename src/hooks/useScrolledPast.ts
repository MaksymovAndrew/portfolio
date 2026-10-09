import type { RefObject } from "react";
import { useEffect, useRef } from "react";

// an empty marker on the page reports whether the window has scrolled past it; no scroll listener runs
export const useScrolledPast = (
    onChange: (past: boolean) => void,
): RefObject<HTMLDivElement | null> => {
    const marker = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = marker.current;

        if (!element) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                onChange(
                    !entry.isIntersecting && entry.boundingClientRect.top < 0,
                );
            });
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [onChange]);

    return marker;
};
