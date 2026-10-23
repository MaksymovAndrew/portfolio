import type { ReactNode } from "react";

import { cx } from "utils/cx";

import styles from "./Chip.module.scss";

export interface ChipProps {
    variant?: "status" | "live";
    children: ReactNode;
}

// "live" is the green badge of a running project; both share the pulsing dot
export const Chip = ({ variant = "status", children }: ChipProps) => (
    <span
        className={cx(
            styles.chip,
            variant === "live" ? styles["chip--live"] : null,
        )}
    >
        <span className={styles.chip__dot} />
        {children}
    </span>
);
