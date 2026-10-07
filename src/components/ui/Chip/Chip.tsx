import type { ReactNode } from "react";

import styles from "./Chip.module.scss";

export interface ChipProps {
    variant?: "status" | "live";
    children: ReactNode;
}

// "live" is the green badge of a running project; both share the pulsing dot
export const Chip = ({ variant = "status", children }: ChipProps) => (
    <span
        className={[
            styles.chip,
            variant === "live" ? styles["chip--live"] : null,
        ]
            .filter(Boolean)
            .join(" ")}
    >
        <span className={styles.chip__dot} />
        {children}
    </span>
);
