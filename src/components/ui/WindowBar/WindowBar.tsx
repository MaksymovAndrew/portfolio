import type { ReactNode } from "react";

import styles from "./WindowBar.module.scss";

export interface WindowBarProps {
    title: string;
    titleId?: string;
    compact?: boolean;
    children?: ReactNode;
}

// the title takes the free width, so whatever comes in as children sits on the right; compact leaves room for a button there
export const WindowBar = ({
    title,
    titleId,
    compact = false,
    children,
}: WindowBarProps) => (
    <div
        className={[
            styles["window-bar"],
            compact ? styles["window-bar--compact"] : null,
        ]
            .filter(Boolean)
            .join(" ")}
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
