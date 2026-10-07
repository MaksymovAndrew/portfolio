import type { ReactNode } from "react";

import { ArrowUpRight } from "components/icons/ArrowUpRight";

import styles from "./TextLink.module.scss";

export interface TextLinkProps {
    href: string;
    externalHint: string;
    children: ReactNode;
}

// always leads off the site: a new tab, the arrow, and the hint read after the name
export const TextLink = ({ href, externalHint, children }: TextLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles["text-link"]}
    >
        {children}
        <ArrowUpRight className={styles["text-link__arrow"]} />
        <span className={styles["text-link__hint"]}>{` ${externalHint}`}</span>
    </a>
);
