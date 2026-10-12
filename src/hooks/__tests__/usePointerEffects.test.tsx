import { act, render, screen } from "@testing-library/react";

import {
    FINE_POINTER_QUERY,
    FORCED_COLORS_QUERY,
    MORE_CONTRAST_QUERY,
    REDUCED_MOTION_QUERY,
} from "constants/motion";

import { usePointerEffects } from "hooks/usePointerEffects";

import { matchMedia } from "test/shims/matchMedia";

const Harness = () => (
    <span data-testid="effects">{String(usePointerEffects())}</span>
);

const effects = () => screen.getByTestId("effects").textContent;

describe("usePointerEffects", () => {
    it("should turn on for a fine pointer that hovers", () => {
        matchMedia(FINE_POINTER_QUERY);
        render(<Harness />);

        expect(effects()).toBe("true");
    });

    it("should stay off on a touch device", () => {
        render(<Harness />);

        expect(effects()).toBe("false");
    });

    it("should stay off under reduced motion", () => {
        matchMedia(FINE_POINTER_QUERY);
        matchMedia(REDUCED_MOTION_QUERY);
        render(<Harness />);

        expect(effects()).toBe("false");
    });

    it("should stay off under forced colours", () => {
        matchMedia(FINE_POINTER_QUERY);
        matchMedia(FORCED_COLORS_QUERY);
        render(<Harness />);

        expect(effects()).toBe("false");
    });

    it("should stay off under increased contrast", () => {
        matchMedia(FINE_POINTER_QUERY);
        matchMedia(MORE_CONTRAST_QUERY);
        render(<Harness />);

        expect(effects()).toBe("false");
    });

    it("should follow a change of the settings", () => {
        render(<Harness />);

        act(() => {
            matchMedia(FINE_POINTER_QUERY);
        });

        expect(effects()).toBe("true");

        act(() => {
            matchMedia(REDUCED_MOTION_QUERY);
        });

        expect(effects()).toBe("false");
    });
});
