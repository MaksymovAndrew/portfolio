"use client";

import type { MouseEvent } from "react";
import { useMemo } from "react";

import type { SectionId } from "types/content";

import { useActiveSection } from "hooks/useActiveSection";

import { activeSectionStore } from "utils/activeSectionStore";
import { cx } from "utils/cx";
import { hasModifier } from "utils/modifiers";
import type { NavItem } from "utils/navItems";

import styles from "./SectionNav.module.scss";

export interface SectionNavProps {
    items: readonly NavItem[];
    label: string;
    variant?: "column" | "sheet";
    onNavigate?: (id: SectionId) => void;
}

// a click with a modifier opens the link elsewhere, so this page stays as it is
const opensElsewhere = (event: MouseEvent): boolean =>
    hasModifier(event) || event.shiftKey;

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
            className={cx(
                styles["section-nav"],
                variant === "sheet" ? styles["section-nav--sheet"] : null,
            )}
        >
            {items.map((item) => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={item.id === current ? "location" : undefined}
                    className={styles["section-nav__link"]}
                    onClick={(event) => {
                        if (opensElsewhere(event)) {
                            return;
                        }

                        activeSectionStore.hold(item.id);
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
