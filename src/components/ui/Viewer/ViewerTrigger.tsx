"use client";

import type { ReactNode } from "react";

import { useHydrated } from "hooks/useHydrated";

import { useViewer } from "./ViewerContext";

export interface ViewerTriggerProps {
    index: number;
    label: string;
    className?: string;
    children: ReactNode;
}

export const ViewerTrigger = ({
    index,
    label,
    className,
    children,
}: ViewerTriggerProps) => {
    const { open } = useViewer();
    const hydrated = useHydrated();

    // the picture shows without JavaScript; the button opens only once hydrated
    return (
        <button
            type="button"
            className={className}
            aria-label={label}
            disabled={!hydrated}
            onClick={(event) => {
                open(index, event.currentTarget);
            }}
        >
            {children}
        </button>
    );
};
