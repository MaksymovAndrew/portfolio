import type { Point } from "utils/pointer";
import { topLayer } from "utils/topLayer";

import type { CursorParts } from "./cursor";
import { createCursor } from "./cursor";
import { createMagnet } from "./magnet";
import { createTilt } from "./tilt";

export interface PointerParts extends CursorParts {
    layer: HTMLElement;
}

const PASSIVE = { passive: true };

// the top layer stacks in opening order, so the cursor opens again after every modal; without the API the system cursor returns inside dialogs
const raiseAbove = (layer: HTMLElement) => {
    if (typeof layer.showPopover !== "function") {
        return;
    }

    if (layer.matches(":popover-open")) {
        layer.hidePopover();
    }

    layer.showPopover();
};

// wires the pointer to the light, the cursor, the magnetic buttons and the tilting cards; returns the way back
export const startPointerEffects = (parts: PointerParts): (() => void) => {
    const root = document.documentElement;
    const cursor = createCursor(parts);
    const magnets = [
        ...document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    ].map(createMagnet);
    const tilts = [
        ...document.querySelectorAll<HTMLElement>("[data-tilt]"),
    ].map(createTilt);
    const followers = [...magnets, ...tilts];
    let pointer: Point | null = null;

    const retarget = (at: Point, target: Element | null) => {
        cursor.hover(target);
        followers.forEach((follower) => {
            follower.track(at);
        });
    };

    const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") {
            return;
        }

        pointer = { x: event.clientX, y: event.clientY };
        // the system cursor goes only once the ring is there to stand in for it
        root.dataset.cursor = "ring";
        cursor.move(pointer);
        retarget(
            pointer,
            event.target instanceof Element ? event.target : null,
        );
    };

    // the page moves under a still pointer: what it is over has changed
    const onScroll = () => {
        if (pointer !== null) {
            retarget(pointer, document.elementFromPoint(pointer.x, pointer.y));
        }
    };

    const onDown = () => {
        cursor.press(true);
    };

    const onUp = () => {
        cursor.press(false);
    };

    const onLeave = () => {
        pointer = null;
        delete root.dataset.cursor;
        cursor.leave();
        followers.forEach((follower) => {
            follower.release();
        });
    };

    const raise = () => {
        raiseAbove(parts.layer);
    };

    raise();

    const unsubscribe = topLayer.subscribe(raise);

    window.addEventListener("pointermove", onMove, PASSIVE);
    window.addEventListener("pointerdown", onDown, PASSIVE);
    window.addEventListener("pointerup", onUp, PASSIVE);
    window.addEventListener("scroll", onScroll, PASSIVE);
    root.addEventListener("mouseleave", onLeave);

    return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("scroll", onScroll);
        root.removeEventListener("mouseleave", onLeave);
        unsubscribe();
        delete root.dataset.cursor;
        cursor.stop();
        followers.forEach((follower) => {
            follower.stop();
        });
    };
};
