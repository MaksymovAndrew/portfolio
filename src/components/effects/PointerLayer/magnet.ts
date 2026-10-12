import type { Point } from "utils/pointer";
import { magnetOffset } from "utils/pointer";

import { spring, watch } from "./springs";

const ACTIVE = "data-pointer";

// a button that leans towards a pointer close to it
export const createMagnet = (element: HTMLElement) => {
    const x = spring("magnet");
    const y = spring("magnet");
    const stopWatch = watch([x, y], () => {
        const rest = x.get() === 0 && y.get() === 0;

        element.style.transform = rest
            ? ""
            : `translate3d(${x.get()}px, ${y.get()}px, 0)`;
    });

    element.setAttribute(ACTIVE, "");

    const release = () => {
        x.set(0);
        y.set(0);
    };

    return {
        track: (pointer: Point) => {
            const rect = element.getBoundingClientRect();
            // where the button rests, without the offset it already follows
            const offset = magnetOffset(pointer, {
                left: rect.left - x.get(),
                top: rect.top - y.get(),
                width: rect.width,
                height: rect.height,
            });

            x.set(offset.x);
            y.set(offset.y);
        },
        release,
        stop: () => {
            stopWatch();
            element.style.removeProperty("transform");
            element.removeAttribute(ACTIVE);
        },
    };
};
