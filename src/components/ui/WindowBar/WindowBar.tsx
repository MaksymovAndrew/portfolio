import type { ReactNode } from "react";

import { cx } from "utils/cx";

import styles from "./WindowBar.module.scss";

export interface WindowBarProps {
    title: string;
    titleId?: string;
    variant?: "regular" | "compact";
    children?: ReactNode;
}

// children sit on the right; the compact variant leaves room for a button there
export const WindowBar = ({
    title,
    titleId,
    variant = "regular",
    children,
}: WindowBarProps) => (
    <div
        className={cx(
            styles["window-bar"],
            variant === "compact" ? styles["window-bar--compact"] : null,
        )}
    >
        <span className={styles["window-bar__dots"]} aria-hidden="true">
            <span className={styles["window-bar__dot"]} />
            <span className={styles["window-bar__dot"]} />
            <span className={styles["window-bar__dot"]} />
        </span>
        <span id={titleId} className={styles["window-bar__title"]}>
            {title}
        </span>
        {children}
    </div>
);
