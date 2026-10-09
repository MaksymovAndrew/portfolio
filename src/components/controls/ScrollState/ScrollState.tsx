"use client";

import { useEffect } from "react";

import { useScrolledPast } from "hooks/useScrolledPast";

import styles from "./ScrollState.module.scss";

const flagScrolled = (scrolled: boolean) => {
    document.documentElement.toggleAttribute("data-scrolled", scrolled);
};

// data-scrolled on <html> while the page is not at its very top; the sticky bar draws its line from it
export const ScrollState = () => {
    const marker = useScrolledPast(flagScrolled);

    useEffect(
        () => () => {
            flagScrolled(false);
        },
        [],
    );

    return (
        <div
            ref={marker}
            className={styles["scroll-state"]}
            aria-hidden="true"
        />
    );
};
