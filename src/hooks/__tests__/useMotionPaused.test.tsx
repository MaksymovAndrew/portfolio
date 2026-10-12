import { act, render, screen } from "@testing-library/react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { useMotionPaused } from "hooks/useMotionPaused";

import { motionStore } from "utils/motionStore";

import { matchMedia } from "test/shims/matchMedia";

const Harness = () => (
    <span data-testid="paused">{String(useMotionPaused())}</span>
);

const paused = () => screen.getByTestId("paused").textContent;

describe("useMotionPaused", () => {
    beforeEach(() => {
        motionStore.set(false);
    });

    it("should follow the pause button", () => {
        render(<Harness />);

        expect(paused()).toBe("false");

        act(() => {
            motionStore.set(true);
        });

        expect(paused()).toBe("true");
    });

    it("should pause once the system asks for reduced motion", () => {
        render(<Harness />);

        act(() => {
            matchMedia(REDUCED_MOTION_QUERY);
        });

        expect(paused()).toBe("true");
    });
});
