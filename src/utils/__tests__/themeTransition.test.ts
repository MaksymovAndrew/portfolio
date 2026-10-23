import { act } from "@testing-library/react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { runThemeTransition } from "utils/themeTransition";

import { matchMedia } from "test/shims/matchMedia";
import {
    abortNextViewTransition,
    enableViewTransitions,
    finishViewTransition,
} from "test/shims/viewTransition";

const root = document.documentElement;
const ORIGIN = { x: 40, y: 30 };

// applies the light theme and notes what the page looks like at that moment
const witness = () => {
    const seen: { vt?: string; x?: string; r?: string } = {};
    const apply = () => {
        seen.vt = root.dataset.vt;
        seen.x = root.style.getPropertyValue("--vt-x");
        seen.r = root.style.getPropertyValue("--vt-r");
        root.dataset.theme = "light";
    };

    return { seen, apply };
};

describe("runThemeTransition", () => {
    beforeEach(() => {
        root.dataset.theme = "dark";
    });

    it("should apply the theme at once without view transitions", () => {
        const { seen, apply } = witness();

        runThemeTransition(ORIGIN, apply);

        expect(root.dataset.theme).toBe("light");
        expect(seen.vt).toBeUndefined();
    });

    it("should start a view transition from the given point", async () => {
        enableViewTransitions();
        const { seen, apply } = witness();

        runThemeTransition(ORIGIN, apply);

        expect(root.dataset.theme).toBe("light");
        expect(seen.vt).toBe("circle");
        expect(seen.x).toBe(`${ORIGIN.x}px`);
        expect(seen.r).toBe(
            `${Math.hypot(window.innerWidth - ORIGIN.x, window.innerHeight - ORIGIN.y)}px`,
        );

        finishViewTransition();

        await act(async () => {
            await Promise.resolve();
        });

        expect(root).not.toHaveAttribute("data-vt");
        expect(root.style.getPropertyValue("--vt-x")).toBe("");
    });

    it("should keep the circle of a second click when the first one ends", async () => {
        enableViewTransitions();
        const { apply } = witness();

        runThemeTransition(ORIGIN, apply);
        runThemeTransition({ x: 90, y: 60 }, apply);
        finishViewTransition();

        await act(async () => {
            await Promise.resolve();
        });

        expect(root.dataset.vt).toBe("circle");
        expect(root.style.getPropertyValue("--vt-x")).toBe("90px");

        finishViewTransition();

        await act(async () => {
            await Promise.resolve();
        });

        expect(root).not.toHaveAttribute("data-vt");
    });

    it("should clear the circle when the browser aborts the transition", async () => {
        enableViewTransitions();
        abortNextViewTransition();
        const { seen, apply } = witness();

        runThemeTransition(ORIGIN, apply);

        await act(async () => {
            await Promise.resolve();
        });

        expect(seen.vt).toBe("circle");
        expect(root).not.toHaveAttribute("data-vt");
    });

    it("should apply at once under reduced motion", () => {
        enableViewTransitions();
        matchMedia(REDUCED_MOTION_QUERY);
        const { seen, apply } = witness();

        runThemeTransition(ORIGIN, apply);

        expect(root.dataset.theme).toBe("light");
        expect(seen.vt).toBeUndefined();
    });

    it("should apply at once without a point to grow from", () => {
        enableViewTransitions();
        const { seen, apply } = witness();

        runThemeTransition(null, apply);

        expect(root.dataset.theme).toBe("light");
        expect(seen.vt).toBeUndefined();
    });
});
