import type { ReactNode } from "react";

import styles from "./Chip.module.scss";

export interface ChipProps {
    children: ReactNode;
}

export const Chip = ({ children }: ChipProps) => (
    <span className={styles.chip}>
        <span className={styles.chip__dot} />
        {children}
    </span>
);
