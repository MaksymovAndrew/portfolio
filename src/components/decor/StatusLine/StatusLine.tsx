"use client";

import { GLYPHS } from "constants/glyphs";

import { useClock } from "hooks/useClock";

import styles from "./StatusLine.module.scss";

export interface StatusLineProps {
    availability: string;
    city: string;
    timeZone: string;
}

const SEPARATOR = ` ${GLYPHS.separator} `;

// the local time arrives after hydration; until then, and without JavaScript, a placeholder holds its place
export const StatusLine = ({
    availability,
    city,
    timeZone,
}: StatusLineProps) => {
    const time = useClock(timeZone);

    return (
        <p className={styles["status-line"]}>
            <span className={styles["status-line__dot"]} />
            <span>
                {`${availability}${SEPARATOR}${city}${SEPARATOR}`}
                <span>{time ?? GLYPHS.clock}</span>
            </span>
        </p>
    );
};
