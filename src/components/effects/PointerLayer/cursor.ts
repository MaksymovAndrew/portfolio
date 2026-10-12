import { CURSOR } from "constants/motion";

import type { Point } from "utils/pointer";

import { spring, watch } from "./springs";

export interface CursorParts {
    spot: HTMLElement;
    dot: HTMLElement;
    ring: HTMLElement;
}

const ON = "data-on";
const HOT = "data-hot";
// what the pointer can press
const INTERACTIVE = 'a, button, summary, label, [role="button"]';

// the light and the ring trail the pointer on springs; the dot sits on it
export const createCursor = ({ spot, dot, ring }: CursorParts) => {
    const spotX = spring("spot");
    const spotY = spring("spot");
    const ringX = spring("ring");
    const ringY = spring("ring");
    const ringScale = spring("ringScale", 1);
    let seen = false;
    let hot = false;
    let pressed = false;

    const stopSpot = watch([spotX, spotY], () => {
        spot.style.transform = `translate3d(${spotX.get()}px, ${spotY.get()}px, 0)`;
    });
    const stopRing = watch([ringX, ringY, ringScale], () => {
        ring.style.transform = `translate3d(${ringX.get()}px, ${ringY.get()}px, 0) scale(${ringScale.get()})`;
    });

    const settleScale = () => {
        const rest = hot ? CURSOR.hotScale : 1;

        ringScale.set(pressed ? CURSOR.pressedScale : rest);
    };

    const show = (visible: boolean) => {
        [spot, dot, ring].forEach((part) => {
            part.toggleAttribute(ON, visible);
        });
    };

    return {
        move: ({ x, y }: Point) => {
            dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            // the first move places everything under the pointer instead of flying in from the corner
            if (!seen) {
                seen = true;
                [spotX, ringX].forEach((value) => {
                    value.jump(x);
                });
                [spotY, ringY].forEach((value) => {
                    value.jump(y);
                });
                show(true);

                return;
            }

            spotX.set(x);
            spotY.set(y);
            ringX.set(x);
            ringY.set(y);
        },
        hover: (target: Element | null) => {
            hot = Boolean(target?.closest(INTERACTIVE));
            ring.toggleAttribute(HOT, hot);
            settleScale();
        },
        press: (down: boolean) => {
            pressed = down;
            settleScale();
        },
        leave: () => {
            seen = false;
            show(false);
        },
        stop: () => {
            stopSpot();
            stopRing();
        },
    };
};
