import type { ReactNode } from "react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

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

const subscribeToNothing = () => () => undefined;

// false on the server and while hydrating, true afterwards: the body to portal into exists only then
const useIsClient = () =>
    useSyncExternalStore(
        subscribeToNothing,
        () => true,
        () => false,
    );

// showModal() brings Escape, the focus trap and the return of focus; every way of closing ends in the close event.
// The dialog lives at the end of the body, so hovering it never hovers the section that opened it
export const Dialog = ({
    open,
    onClose,
    variant,
    labelledBy,
    label,
    children,
}: DialogProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    const isClient = useIsClient();

    useEffect(() => {
        const dialog = ref.current;

        if (!dialog || dialog.open === open) {
            return;
        }

        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open, isClient]);

    // the pointer's way out; the keyboard has Escape. A press inside that ends on the backdrop is a selection, not a dismissal
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
                  className={[styles.dialog, styles[`dialog--${variant}`]].join(
                      " ",
                  )}
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
