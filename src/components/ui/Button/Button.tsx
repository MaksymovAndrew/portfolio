import type { ReactNode } from "react";

import styles from "./Button.module.scss";

export interface ButtonProps {
    variant: "primary" | "ghost";
    onClick: () => void;
    children: ReactNode;
}

export interface ButtonLinkProps {
    href: string;
    variant: "primary" | "ghost";
    magnetic?: boolean;
    children: ReactNode;
}

const buttonClass = (variant: ButtonProps["variant"]) =>
    [styles.button, styles[`button--${variant}`]].join(" ");

export const Button = ({ variant, onClick, children }: ButtonProps) => (
    <button type="button" className={buttonClass(variant)} onClick={onClick}>
        {children}
    </button>
);

// data-magnetic lets the pointer effects find the buttons that follow the cursor
export const ButtonLink = ({
    href,
    variant,
    magnetic = false,
    children,
}: ButtonLinkProps) => (
    <a
        href={href}
        className={buttonClass(variant)}
        data-magnetic={magnetic ? "" : undefined}
    >
        {children}
    </a>
);
