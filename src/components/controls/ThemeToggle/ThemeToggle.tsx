"use client";

import { useTheme } from "hooks/useTheme";

import { Moon } from "components/icons/Moon";
import { Sun } from "components/icons/Sun";

import styles from "./ThemeToggle.module.scss";

export interface ThemeToggleProps {
    label: string;
}

// both icons are always there and CSS shows one, so the markup is the same in every theme
export const ThemeToggle = ({ label }: ThemeToggleProps) => {
    const { toggle } = useTheme();

    return (
        <button
            type="button"
            className={styles["theme-toggle"]}
            aria-label={label}
            onClick={toggle}
        >
            <Sun className={styles["theme-toggle__sun"]} />
            <Moon className={styles["theme-toggle__moon"]} />
        </button>
    );
};
