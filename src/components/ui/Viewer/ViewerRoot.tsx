"use client";

import type { ReactNode } from "react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

import { Dialog } from "components/ui/Dialog";

import { wrapIndex } from "utils/wrapIndex";

import type { ViewerItem, ViewerLabels } from "./Viewer";
import { Viewer } from "./Viewer";
import { ViewerContext } from "./ViewerContext";

export interface ViewerRootProps {
    items: readonly ViewerItem[];
    labels: ViewerLabels;
    children: ReactNode;
}

// server components place the triggers as children; the root keeps which item is open and draws the dialog
export const ViewerRoot = ({ items, labels, children }: ViewerRootProps) => {
    const [index, setIndex] = useState<number | null>(null);
    const opener = useRef<HTMLElement | null>(null);
    const titleId = useId();
    const { length } = items;

    const open = useCallback((next: number, trigger: HTMLElement) => {
        opener.current = trigger;
        setIndex(next);
    }, []);
    const controls = useMemo(() => ({ open }), [open]);

    const step = useCallback(
        (delta: number) => {
            setIndex((current) =>
                current === null ? null : wrapIndex(current, delta, length),
            );
        },
        [length],
    );
    const close = useCallback(() => {
        setIndex(null);
    }, []);

    // Safari does not focus a clicked button, so the browser alone would hand the focus to the page
    const returnFocus = () => {
        setIndex(null);
        opener.current?.focus();
    };

    return (
        <ViewerContext value={controls}>
            {children}
            <Dialog
                open={index !== null}
                onClose={returnFocus}
                variant="window"
                labelledBy={titleId}
            >
                {index === null ? null : (
                    <Viewer
                        items={items}
                        index={index}
                        labels={labels}
                        titleId={titleId}
                        onStep={step}
                        onClose={close}
                    />
                )}
            </Dialog>
        </ViewerContext>
    );
};
