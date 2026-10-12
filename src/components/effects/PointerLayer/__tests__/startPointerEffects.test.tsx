import { act, render, screen } from "@testing-library/react";

import { startPointerEffects } from "components/effects/PointerLayer/startPointerEffects";

const root = document.documentElement;
const CARD = { left: 100, top: 100, width: 200, height: 100 };
const DRIVEN = "data-pointer";
const TILTING = "data-tilting";
const SHOWN = "data-on";
const CURSOR_FLAG = "data-cursor";

const part = () => document.createElement("div");

// the page the effects find: a magnetic button and a tilting card with a link inside
const setUp = () => {
    render(
        <>
            <a data-magnetic="" href="#contact">
                Contact
            </a>
            <article data-tilt="">
                <a href="#more">More</a>
            </article>
        </>,
    );
    const card = screen.getByRole("article");

    // jsdom lays nothing out; the card gets the size a browser would give it
    jest.spyOn(card, "getBoundingClientRect").mockReturnValue(
        new DOMRect(CARD.left, CARD.top, CARD.width, CARD.height),
    );

    const parts = { spot: part(), layer: part(), dot: part(), ring: part() };

    return {
        card,
        button: screen.getByRole("link", { name: "Contact" }),
        inner: screen.getByRole("link", { name: "More" }),
        parts,
        stop: startPointerEffects(parts),
    };
};

const movePointer = (target: Element, x: number, y: number) => {
    act(() => {
        target.dispatchEvent(
            new MouseEvent("pointermove", {
                clientX: x,
                clientY: y,
                bubbles: true,
            }),
        );
    });
};

describe("startPointerEffects", () => {
    it("should mark what it drives and keep the system cursor until the pointer moves", () => {
        const { card, button, stop } = setUp();
        const before = root.getAttribute(CURSOR_FLAG);

        movePointer(document.body, 20, 30);

        expect(before).toBeNull();
        expect(root).toHaveAttribute(CURSOR_FLAG, "ring");
        expect(card).toHaveAttribute(DRIVEN);
        expect(button).toHaveAttribute(DRIVEN);

        stop();
    });

    it("should show the cursor under the first move", () => {
        const { parts, stop } = setUp();

        movePointer(document.body, 20, 30);

        expect(parts.dot.style.transform).toBe("translate3d(20px, 30px, 0)");
        expect(parts.ring).toHaveAttribute(SHOWN);
        expect(parts.spot).toHaveAttribute(SHOWN);

        stop();
    });

    it("should light the ring over a link", () => {
        const { inner, parts, stop } = setUp();

        movePointer(inner, 150, 120);

        expect(parts.ring).toHaveAttribute("data-hot");

        movePointer(document.body, 10, 10);

        expect(parts.ring).not.toHaveAttribute("data-hot");

        stop();
    });

    it("should tilt the card under the pointer and move its glare there", () => {
        const { card, stop } = setUp();

        movePointer(card, 150, 125);

        expect(card).toHaveAttribute(TILTING);
        expect(card.style.getPropertyValue("--gx")).toBe("25%");
        expect(card.style.getPropertyValue("--gy")).toBe("25%");

        movePointer(document.body, 10, 10);

        expect(card).not.toHaveAttribute(TILTING);

        stop();
    });

    it("should ignore a finger", () => {
        const { parts, stop } = setUp();
        const touch = new MouseEvent("pointermove", { clientX: 5, clientY: 5 });

        Object.assign(touch, { pointerType: "touch" });
        act(() => {
            window.dispatchEvent(touch);
        });

        expect(parts.ring).not.toHaveAttribute(SHOWN);

        stop();
    });

    it("should hide the cursor once the pointer leaves the window", () => {
        const { card, parts, stop } = setUp();

        movePointer(card, 150, 125);
        act(() => {
            root.dispatchEvent(new MouseEvent("mouseleave"));
        });

        expect(parts.ring).not.toHaveAttribute(SHOWN);
        expect(card).not.toHaveAttribute(TILTING);
        expect(root).not.toHaveAttribute(CURSOR_FLAG);

        stop();
    });

    it("should leave the page as it found it when it stops", () => {
        const { card, button, stop } = setUp();

        movePointer(card, 150, 125);
        stop();

        expect(root).not.toHaveAttribute(CURSOR_FLAG);
        expect(card).not.toHaveAttribute(DRIVEN);
        expect(card).not.toHaveAttribute(TILTING);
        expect(card.style.getPropertyValue("--gx")).toBe("");
        expect(button.style.transform).toBe("");
    });
});
