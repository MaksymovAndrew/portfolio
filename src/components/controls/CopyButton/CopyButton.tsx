"use client";

import type { Content } from "types/content";

import { useCopy } from "hooks/useCopy";
import { useHydrated } from "hooks/useHydrated";

import { Check } from "components/icons/Check";
import { Copy } from "components/icons/Copy";

import { cx } from "utils/cx";

import styles from "./CopyButton.module.scss";

export interface CopyButtonProps {
    value: string;
    targetId: string;
    labels: Content["ui"]["copy"];
}

// the note is for the eye; the status region tells a screen reader, and it exists before anything is written into it
export const CopyButton = ({ value, targetId, labels }: CopyButtonProps) => {
    const { copied, copy } = useCopy(value, targetId);
    const hydrated = useHydrated();

    return (
        <>
            <button
                type="button"
                className={cx(
                    styles["copy-button"],
                    copied ? styles["copy-button--done"] : null,
                )}
                aria-label={labels.label}
                title={labels.label}
                data-ready={hydrated || undefined}
                onClick={() => {
                    void copy();
                }}
            >
                {copied ? <Check /> : <Copy />}
                {copied ? (
                    <span
                        className={styles["copy-button__note"]}
                        aria-hidden="true"
                    >
                        {labels.done}
                    </span>
                ) : null}
            </button>
            <span className={styles["copy-button__status"]} role="status">
                {copied ? labels.status : null}
            </span>
        </>
    );
};
