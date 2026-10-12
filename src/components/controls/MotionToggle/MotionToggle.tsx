"use client";

import { useHydrated } from "hooks/useHydrated";
import { useReducedMotion } from "hooks/useReducedMotion";

import { Pause } from "components/icons/Pause";
import { Play } from "components/icons/Play";

import { motionStore } from "utils/motionStore";

import styles from "./MotionToggle.module.scss";

export interface MotionToggleProps {
    labels: { pause: string; resume: string };
}

// both states are in the markup and CSS shows one, so the button is right before hydration too
export const MotionToggle = ({ labels }: MotionToggleProps) => {
    const reduced = useReducedMotion();
    const hydrated = useHydrated();

    if (reduced) {
        return null;
    }

    return (
        <button
            type="button"
            className={styles["motion-toggle"]}
            data-ready={hydrated || undefined}
            onClick={motionStore.toggle}
        >
            <Pause className={styles["motion-toggle__pause"]} />
            <Play className={styles["motion-toggle__play"]} />
            <span className={styles["motion-toggle__pause"]}>
                {labels.pause}
            </span>
            <span className={styles["motion-toggle__play"]}>
                {labels.resume}
            </span>
        </button>
    );
};
