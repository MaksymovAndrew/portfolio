import type { ReactNode } from "react";

import { GLYPHS } from "constants/glyphs";

import styles from "./Entry.module.scss";

export interface EntryProps {
    title: string;
    period: string;
    organisation: string;
    meta: string | null;
    detail?: string;
    children?: ReactNode;
}

export const Entry = ({
    title,
    period,
    organisation,
    meta,
    detail,
    children,
}: EntryProps) => (
    <article className={styles.entry}>
        <div className={styles.entry__head}>
            <h3 className={styles.entry__title}>{title}</h3>
            <span className={styles.entry__period}>{period}</span>
        </div>
        <p className={styles.entry__organisation}>
            <b>{organisation}</b>
            {meta === null ? null : ` ${GLYPHS.separator} ${meta}`}
            {detail ? (
                <>
                    <br />
                    {detail}
                </>
            ) : null}
        </p>
        {children}
    </article>
);
