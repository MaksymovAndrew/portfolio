import type { ReactNode } from "react";

import { ArrowUpRight } from "components/icons/ArrowUpRight";

import styles from "./TextLink.module.scss";

export interface TextLinkProps {
    href: string;
    externalHint: string;
    small?: boolean;
    className?: string;
    children: ReactNode;
}

// always leads off the site: a new tab, the arrow, and the hint read after the name
export const TextLink = ({
    href,
    externalHint,
    small = false,
    className,
    children,
}: TextLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={[
            styles["text-link"],
            small ? styles["text-link--small"] : null,
            className,
        ]
            .filter(Boolean)
            .join(" ")}
    >
        {children}
        <ArrowUpRight className={styles["text-link__arrow"]} />
        <span className={styles["text-link__hint"]}>{` ${externalHint}`}</span>
    </a>
);
