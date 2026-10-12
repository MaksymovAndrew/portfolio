"use client";

import type { MouseEvent } from "react";

import { useHydrated } from "hooks/useHydrated";
import { useTheme } from "hooks/useTheme";

import { Moon } from "components/icons/Moon";
import { Sun } from "components/icons/Sun";

import { runThemeTransition } from "utils/themeTransition";

import styles from "./ThemeToggle.module.scss";

export interface ThemeToggleProps {
    label: string;
}

// a click grows the circle from the pointer; a key press, which has no point, from the button's centre
const originOf = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail > 0) {
        return { x: event.clientX, y: event.clientY };
    }

    const box = event.currentTarget.getBoundingClientRect();

    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
};

// both icons are always there and CSS shows one, so the markup is the same in every theme
export const ThemeToggle = ({ label }: ThemeToggleProps) => {
    const { toggle } = useTheme();
    const hydrated = useHydrated();

    return (
        <button
            type="button"
            className={styles["theme-toggle"]}
            aria-label={label}
            data-ready={hydrated || undefined}
            onClick={(event) => {
                runThemeTransition(originOf(event), toggle);
            }}
        >
            <Sun className={styles["theme-toggle__sun"]} />
            <Moon className={styles["theme-toggle__moon"]} />
        </button>
    );
};
