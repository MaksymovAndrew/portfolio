"use client";

import type { ReactNode } from "react";

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

    return (
        <button
            type="button"
            className={className}
            aria-label={label}
            onClick={(event) => {
                open(index, event.currentTarget);
            }}
        >
            {children}
        </button>
    );
};
