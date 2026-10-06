import type { ReactNode } from "react";

import styles from "./Button.module.scss";

export interface ButtonLinkProps {
    href: string;
    variant: "primary" | "ghost";
    magnetic?: boolean;
    children: ReactNode;
}

// data-magnetic lets the pointer effects find the buttons that follow the cursor
export const ButtonLink = ({
    href,
    variant,
    magnetic = false,
    children,
}: ButtonLinkProps) => (
    <a
        href={href}
        className={[styles.button, styles[`button--${variant}`]].join(" ")}
        data-magnetic={magnetic ? "" : undefined}
    >
        {children}
    </a>
);
