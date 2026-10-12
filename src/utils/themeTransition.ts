import { REDUCED_MOTION_QUERY } from "constants/motion";

import type { Point } from "utils/pointer";
import { circleRadius } from "utils/pointer";

const VARIABLES = ["--vt-x", "--vt-y", "--vt-r"];

// a second click skips the first transition; only the latest one may clear the flags
let latest: ViewTransition | null = null;

const clear = () => {
    const root = document.documentElement;

    delete root.dataset.vt;
    VARIABLES.forEach((name) => {
        root.style.removeProperty(name);
    });
};

// the new theme grows in a circle from the origin; without the API, under reduced motion or with no origin it applies at once
export const runThemeTransition = (
    origin: Point | null,
    apply: () => void,
): void => {
    // older browsers have no such method, whatever the types say
    const canTransition = typeof document.startViewTransition === "function";
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const instant = !canTransition || reduced || origin === null;

    if (instant) {
        apply();

        return;
    }

    const root = document.documentElement;
    const radius = circleRadius(origin, {
        width: window.innerWidth,
        height: window.innerHeight,
    });

    root.dataset.vt = "circle";
    root.style.setProperty("--vt-x", `${origin.x}px`);
    root.style.setProperty("--vt-y", `${origin.y}px`);
    root.style.setProperty("--vt-r", `${radius}px`);

    const transition = document.startViewTransition(apply);
    const end = () => {
        if (latest === transition) {
            latest = null;
            clear();
        }
    };

    latest = transition;
    // the browser aborts a transition when the window resizes mid-way; that ends it too
    transition.ready.catch(end);
    transition.finished.then(end, end);
};
