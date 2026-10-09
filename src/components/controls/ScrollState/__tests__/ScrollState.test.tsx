import { act, render } from "@testing-library/react";

import { ScrollState } from "components/controls/ScrollState";

import { intersectAll } from "test/shims/intersectionObserver";

const root = document.documentElement;
const FLAG = "data-scrolled";
// the top of the page, 20px above the window
const ABOVE = -20;

describe("ScrollState", () => {
    it("should flag the page as scrolled when the top sentinel leaves", () => {
        render(<ScrollState />);

        act(() => {
            intersectAll(false, ABOVE);
        });
        const scrolled = root.hasAttribute(FLAG);

        act(() => {
            intersectAll(true);
        });

        expect(scrolled).toBe(true);
        expect(root).not.toHaveAttribute(FLAG);
    });

    it("should drop the flag when it goes away", () => {
        const { unmount } = render(<ScrollState />);

        act(() => {
            intersectAll(false, ABOVE);
        });
        unmount();

        expect(root).not.toHaveAttribute(FLAG);
    });
});
