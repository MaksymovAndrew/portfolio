import { act, render } from "@testing-library/react";

import { FINE_POINTER_QUERY, REDUCED_MOTION_QUERY } from "constants/motion";

import { PointerEffects } from "components/effects/PointerEffects";

import { matchMedia } from "test/shims/matchMedia";

const root = document.documentElement;
const CURSOR_FLAG = "data-cursor";

const moveMouse = () => {
    act(() => {
        window.dispatchEvent(new MouseEvent("pointermove"));
    });
};

// the layer arrives through a dynamic import
const settle = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("PointerEffects", () => {
    it("should not load the pointer layer on a touch device", async () => {
        const { container } = render(<PointerEffects />);

        moveMouse();
        await settle();

        expect(container).toBeEmptyDOMElement();
        expect(root).not.toHaveAttribute(CURSOR_FLAG);
    });

    it("should wait for the first move of the mouse", async () => {
        matchMedia(FINE_POINTER_QUERY);
        const { container } = render(<PointerEffects />);

        await settle();

        expect(container).toBeEmptyDOMElement();

        moveMouse();
        await settle();

        expect(container).not.toBeEmptyDOMElement();
    });

    it("should bring the pointer layer for a mouse", async () => {
        matchMedia(FINE_POINTER_QUERY);
        const { container } = render(<PointerEffects />);

        moveMouse();
        await settle();

        expect(container).not.toBeEmptyDOMElement();
    });

    it("should take the layer away once motion is reduced", async () => {
        matchMedia(FINE_POINTER_QUERY);
        const { container } = render(<PointerEffects />);

        moveMouse();
        await settle();
        act(() => {
            matchMedia(REDUCED_MOTION_QUERY);
        });

        expect(container).toBeEmptyDOMElement();
        expect(root).not.toHaveAttribute(CURSOR_FLAG);
    });
});
