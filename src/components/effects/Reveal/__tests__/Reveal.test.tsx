import { act, fireEvent, render, screen } from "@testing-library/react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { Reveal } from "components/effects/Reveal";

import { intersect } from "test/shims/intersectionObserver";
import { matchMedia } from "test/shims/matchMedia";

const FLAG = "data-reveal";
// below the bottom of the window
const BELOW = window.innerHeight + 200;

const Page = () => (
    <>
        <Reveal />
        <main>
            <section>
                <p>first</p>
                <div data-testid="link-block">
                    <a href="#below">below</a>
                </div>
            </section>
        </main>
        <footer>end</footer>
    </>
);

const block = (text: string) => screen.getByText(text);
const linkBlock = () => screen.getByTestId("link-block");

describe("Reveal", () => {
    beforeEach(() => {
        document.documentElement.classList.add("js");
    });

    afterEach(() => {
        document.documentElement.classList.remove("js");
    });

    it("should leave elements already in view alone", () => {
        render(<Page />);

        act(() => {
            intersect(block("first"), true);
            intersect(block("first"), false, BELOW);
        });

        expect(block("first")).not.toHaveAttribute(FLAG);
    });

    it("should leave a block at the bottom edge of the window alone", () => {
        render(<Page />);

        // on screen, yet outside the trimmed area that starts the rise
        act(() => {
            intersect(block("end"), false, window.innerHeight - 20);
        });

        expect(block("end")).not.toHaveAttribute(FLAG);
    });

    it("should reveal an element once when it enters", () => {
        render(<Page />);

        act(() => {
            intersect(block("end"), false, BELOW);
        });
        const waiting = block("end").getAttribute(FLAG);

        act(() => {
            intersect(block("end"), true);
        });
        const revealed = block("end").getAttribute(FLAG);

        act(() => {
            intersect(block("end"), false, BELOW);
        });

        expect(waiting).toBe("");
        expect(revealed).toBe("in");
        expect(block("end")).toHaveAttribute(FLAG, "in");
    });

    it("should hand the element back once it has risen", () => {
        render(<Page />);

        act(() => {
            intersect(block("end"), false, BELOW);
            intersect(block("end"), true);
            block("end").dispatchEvent(new Event("transitionend"));
        });

        expect(block("end")).not.toHaveAttribute(FLAG);
    });

    it("should show a waiting block once focus lands inside it", () => {
        render(<Page />);

        act(() => {
            intersect(linkBlock(), false, BELOW);
        });
        fireEvent.focusIn(screen.getByRole("link"));

        expect(linkBlock()).toHaveAttribute(FLAG, "in");
    });

    it("should do nothing under reduced motion", () => {
        matchMedia(REDUCED_MOTION_QUERY);
        render(<Page />);

        act(() => {
            intersect(block("end"), false, BELOW);
        });

        expect(block("end")).not.toHaveAttribute(FLAG);
    });

    it("should hide nothing without scripts flagged on the page", () => {
        document.documentElement.classList.remove("js");
        render(<Page />);

        act(() => {
            intersect(block("end"), false, BELOW);
        });

        expect(block("end")).not.toHaveAttribute(FLAG);
    });

    it("should show every waiting element when it goes away", () => {
        const { unmount } = render(<Page />);
        const end = block("end");

        act(() => {
            intersect(end, false, BELOW);
        });
        unmount();

        expect(end).not.toHaveAttribute(FLAG);
    });
});
