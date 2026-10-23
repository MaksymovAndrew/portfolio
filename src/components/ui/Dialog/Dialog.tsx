import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useHydrated } from "hooks/useHydrated";

import { cx } from "utils/cx";
import { topLayer } from "utils/topLayer";

import styles from "./Dialog.module.scss";

// a dialog is named by a visible title or, without one, by a label
type DialogName =
    | { labelledBy: string; label?: never }
    | { label: string; labelledBy?: never };

export type DialogProps = DialogName & {
    open: boolean;
    onClose: () => void;
    variant: "window" | "sheet";
    children: ReactNode;
};

// portalled to the end of the body, so hovering it never hovers the section that opened it
export const Dialog = ({
    open,
    onClose,
    variant,
    labelledBy,
    label,
    children,
}: DialogProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    // the body to portal into exists only once hydrated
    const isClient = useHydrated();

    useEffect(() => {
        const dialog = ref.current;

        if (!dialog || dialog.open === open) {
            return;
        }

        if (open) {
            dialog.showModal();
            topLayer.notify();
        } else {
            dialog.close();
        }
    }, [open, isClient]);

    // a press on the backdrop closes; one that started inside is a text selection
    useEffect(() => {
        const dialog = ref.current;

        if (!dialog) {
            return undefined;
        }

        let pressedOnBackdrop = false;
        const notePress = (event: Event) => {
            pressedOnBackdrop = event.target === dialog;
        };
        const closeOnBackdrop = (event: Event) => {
            if (pressedOnBackdrop && event.target === dialog) {
                dialog.close();
            }
        };

        dialog.addEventListener("pointerdown", notePress);
        dialog.addEventListener("click", closeOnBackdrop);

        return () => {
            dialog.removeEventListener("pointerdown", notePress);
            dialog.removeEventListener("click", closeOnBackdrop);
        };
    }, [isClient]);

    return isClient
        ? createPortal(
              <dialog
                  ref={ref}
                  className={cx(styles.dialog, styles[`dialog--${variant}`])}
                  aria-labelledby={labelledBy}
                  aria-label={label}
                  onClose={onClose}
              >
                  {children}
              </dialog>,
              document.body,
          )
        : null;
};
