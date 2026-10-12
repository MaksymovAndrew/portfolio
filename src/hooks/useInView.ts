import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

// whether the element is on screen; an element not drawn (display: none, a hidden column) never is
export const useInView = (): [RefObject<HTMLDivElement | null>, boolean] => {
    const element = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const target = element.current;

        if (!target) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setInView(entry.isIntersecting);
            });
        });

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, []);

    return [element, inView];
};
