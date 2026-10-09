"use client";

import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";

import type { SectionId } from "types/content";

import { SectionNav } from "components/controls/SectionNav";
import { Close } from "components/icons/Close";
import { Menu } from "components/icons/Menu";
import { Dialog } from "components/ui/Dialog";
import { SectionLabel } from "components/ui/SectionLabel";

import type { NavItem } from "utils/navItems";

import styles from "./MenuSheet.module.scss";

export interface MenuSheetProps {
    items: readonly NavItem[];
    labels: { open: string; title: string; close: string; sections: string };
    children?: ReactNode;
}

// the button stays in the top bar; the sheet itself is drawn at the end of the body by the dialog
export const MenuSheet = ({ items, labels, children }: MenuSheetProps) => {
    const [open, setOpen] = useState(false);
    const button = useRef<HTMLButtonElement>(null);
    const titleId = useId();

    const chosen = useRef<SectionId | null>(null);

    const close = () => {
        setOpen(false);
    };

    const follow = (id: SectionId) => {
        chosen.current = id;
        setOpen(false);
    };

    // a chosen section takes the focus and the anchor scrolls; else the button, as Safari does not focus a clicked one
    const returnFocus = () => {
        setOpen(false);

        const target = chosen.current
            ? document.getElementById(chosen.current)
            : null;

        chosen.current = null;
        (target ?? button.current)?.focus({ preventScroll: target !== null });
    };

    return (
        <>
            <button
                ref={button}
                type="button"
                className={styles["menu-button"]}
                aria-label={labels.open}
                aria-haspopup="dialog"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <Menu />
            </button>
            <Dialog
                open={open}
                onClose={returnFocus}
                variant="sheet"
                labelledBy={titleId}
            >
                <div
                    className={styles["menu-sheet__grip"]}
                    aria-hidden="true"
                />
                <div className={styles["menu-sheet__head"]}>
                    <SectionLabel id={titleId}>{labels.title}</SectionLabel>
                    <button
                        type="button"
                        className={styles["menu-sheet__close"]}
                        aria-label={labels.close}
                        onClick={close}
                    >
                        <Close />
                    </button>
                </div>
                <SectionNav
                    items={items}
                    label={labels.sections}
                    variant="sheet"
                    onNavigate={follow}
                />
                {children ? (
                    <div className={styles["menu-sheet__foot"]}>{children}</div>
                ) : null}
            </Dialog>
        </>
    );
};
