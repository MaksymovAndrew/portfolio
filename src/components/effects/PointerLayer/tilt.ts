import { TILT } from "constants/motion";

import type { Point } from "utils/pointer";
import { tiltPose } from "utils/pointer";

import { spring, watch } from "./springs";

const ACTIVE = "data-pointer";
const TILTING = "data-tilting";
const GLARE = ["--gx", "--gy"];

// a card that turns towards the pointer above it, with a glare under the pointer
export const createTilt = (element: HTMLElement) => {
    const rotateX = spring("tilt");
    const rotateY = spring("tilt");
    const lift = spring("tilt");
    const stopWatch = watch([rotateX, rotateY, lift], () => {
        const values = [rotateX.get(), rotateY.get(), lift.get()];
        const rest = values.every((value) => value === 0);

        element.style.transform = rest
            ? ""
            : `perspective(${TILT.perspective}px) translate3d(0, ${lift.get()}px, 0) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`;
    });

    element.setAttribute(ACTIVE, "");

    const release = () => {
        rotateX.set(0);
        rotateY.set(0);
        lift.set(0);
        element.removeAttribute(TILTING);
    };

    return {
        track: (pointer: Point) => {
            const rect = element.getBoundingClientRect();
            // where the card rests, without the lift it already follows
            const pose = tiltPose(pointer, {
                left: rect.left,
                top: rect.top - lift.get(),
                width: rect.width,
                height: rect.height,
            });

            if (pose === null) {
                release();

                return;
            }

            rotateX.set(pose.rotateX);
            rotateY.set(pose.rotateY);
            lift.set(-TILT.lift);
            element.style.setProperty("--gx", `${pose.glareX}%`);
            element.style.setProperty("--gy", `${pose.glareY}%`);
            element.setAttribute(TILTING, "");
        },
        release,
        stop: () => {
            stopWatch();
            element.style.removeProperty("transform");
            GLARE.forEach((name) => {
                element.style.removeProperty(name);
            });
            element.removeAttribute(ACTIVE);
            element.removeAttribute(TILTING);
        },
    };
};
