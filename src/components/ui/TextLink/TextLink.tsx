import type { ReactNode } from "react";

import { ArrowUpRight } from "components/icons/ArrowUpRight";

import { cx } from "utils/cx";

import styles from "./TextLink.module.scss";

export interface TextLinkProps {
    href: string;
    externalHint: string;
    variant?: "regular" | "small";
    className?: string;
    children: ReactNode;
}

// always leads off the site: a new tab, the arrow, and the hint read after the name
export const TextLink = ({
    href,
    externalHint,
    variant = "regular",
    className,
    children,
}: TextLinkProps) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cx(
            styles["text-link"],
            variant === "small" ? styles["text-link--small"] : null,
            className,
        )}
    >
        {children}
        <ArrowUpRight className={styles["text-link__arrow"]} />
        <span className={styles["text-link__hint"]}>{` ${externalHint}`}</span>
    </a>
);
