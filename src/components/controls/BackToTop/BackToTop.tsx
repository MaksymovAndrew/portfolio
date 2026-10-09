"use client";

import { useState } from "react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { useScrolledPast } from "hooks/useScrolledPast";

import { ArrowUp } from "components/icons/ArrowUp";

import styles from "./BackToTop.module.scss";

export interface BackToTopProps {
    label: string;
    targetId: string;
}

// the button goes away at the top, so the focus moves first to where a reader at the top would start
const scrollToTop = (targetId: string) => {
    document.getElementById(targetId)?.focus({ preventScroll: true });
    window.scrollTo({
        top: 0,
        behavior: window.matchMedia(REDUCED_MOTION_QUERY).matches
            ? "auto"
            : "smooth",
    });
};

// appears once the reader is past the first screen; CSS keeps it to the widths without the left column
export const BackToTop = ({ label, targetId }: BackToTopProps) => {
    const [shown, setShown] = useState(false);
    const marker = useScrolledPast(setShown);

    return (
        <>
            <div
                ref={marker}
                className={styles["back-to-top__marker"]}
                aria-hidden="true"
            />
            {shown ? (
                <button
                    type="button"
                    className={styles["back-to-top"]}
                    aria-label={label}
                    onClick={() => {
                        scrollToTop(targetId);
                    }}
                >
                    <ArrowUp />
                </button>
            ) : null}
        </>
    );
};
