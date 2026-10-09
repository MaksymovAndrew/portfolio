"use client";

import { useMemo } from "react";

import type { SectionId } from "types/content";

import { useActiveSection } from "hooks/useActiveSection";

import type { NavItem } from "utils/navItems";

import styles from "./SectionNav.module.scss";

export interface SectionNavProps {
    items: readonly NavItem[];
    label: string;
    variant?: "column" | "sheet";
    onNavigate?: (id: SectionId) => void;
}

// plain anchors, so the links work before and without JavaScript; the store only marks the current one
export const SectionNav = ({
    items,
    label,
    variant = "column",
    onNavigate,
}: SectionNavProps) => {
    const ids = useMemo(() => items.map((item) => item.id), [items]);
    const current = useActiveSection(ids);

    return (
        <nav
            aria-label={label}
            className={[
                styles["section-nav"],
                variant === "sheet" ? styles["section-nav--sheet"] : null,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={item.id === current ? "location" : undefined}
                    className={styles["section-nav__link"]}
                    onClick={() => {
                        onNavigate?.(item.id);
                    }}
                >
                    <span
                        className={styles["section-nav__bar"]}
                        aria-hidden="true"
                    />
                    {item.label}
                </a>
            ))}
        </nav>
    );
};
