import { act, fireEvent, render, screen } from "@testing-library/react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { BackToTop } from "components/controls/BackToTop";

import { intersectAll } from "test/shims/intersectionObserver";
import { matchMedia } from "test/shims/matchMedia";

const LABEL = "Back to top";
const MAIN_ID = "main";
// the marker's distance from the top of the window: above it once the reader is past the first screen
const PAST = -200;
const BELOW = 2000;

const renderAt = (top: number) => {
    render(
        <>
            <main id={MAIN_ID} tabIndex={-1} />
            <BackToTop label={LABEL} targetId={MAIN_ID} />
        </>,
    );
    act(() => {
        intersectAll(false, top);
    });
};

const mockScrollTo = () =>
    jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);

describe("BackToTop", () => {
    it("should show the button after the first screen", () => {
        renderAt(PAST);

        expect(screen.getByRole("button", { name: LABEL })).toBeInTheDocument();
    });

    it("should hide the button back at the top", () => {
        renderAt(PAST);
        act(() => {
            intersectAll(true);
        });

        expect(() => screen.getByRole("button")).toThrow();
    });

    it("should stay hidden while the first screen is still below", () => {
        renderAt(BELOW);

        expect(() => screen.getByRole("button")).toThrow();
    });

    it("should scroll to the top on click", () => {
        const scrollTo = mockScrollTo();

        renderAt(PAST);
        fireEvent.click(screen.getByRole("button", { name: LABEL }));

        expect(scrollTo.mock.calls).toEqual([[{ top: 0, behavior: "smooth" }]]);
        expect(screen.getByRole("main")).toHaveFocus();
    });

    it("should jump without motion when motion is reduced", () => {
        const scrollTo = mockScrollTo();

        matchMedia(REDUCED_MOTION_QUERY);
        renderAt(PAST);
        fireEvent.click(screen.getByRole("button", { name: LABEL }));

        expect(scrollTo.mock.calls).toEqual([[{ top: 0, behavior: "auto" }]]);
    });
});
