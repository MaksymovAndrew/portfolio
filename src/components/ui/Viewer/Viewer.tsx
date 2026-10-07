import Image from "next/image";
import { useEffect } from "react";

import { GLYPHS } from "constants/glyphs";
import { IMAGE_SIZES } from "constants/images";
import type { Content } from "types/content";

import { Placeholder } from "components/decor/Placeholder";
import { ArrowLeft } from "components/icons/ArrowLeft";
import { ArrowRight } from "components/icons/ArrowRight";
import { Close } from "components/icons/Close";
import { TextLink } from "components/ui/TextLink";
import { WindowBar } from "components/ui/WindowBar";

import { placeholderLabel } from "utils/placeholderLabel";

import styles from "./Viewer.module.scss";

export interface ViewerItem {
    kind: "screenshot" | "certificate";
    name: string;
    title: string;
    meta: string | null;
    image: Content["projects"]["items"][number]["screenshots"][number]["image"];
    verifyHref: string | null;
}

export interface ViewerLabels {
    close: string;
    previous: string;
    next: string;
    verify: string;
    externalHint: string;
}

interface ViewerProps {
    items: readonly ViewerItem[];
    index: number;
    labels: ViewerLabels;
    titleId: string;
    onStep: (delta: number) => void;
    onClose: () => void;
}

// the inside of the open dialog; the arrow keys work wherever the focus is while it is open
export const Viewer = ({
    items,
    index,
    labels,
    titleId,
    onStep,
    onClose,
}: ViewerProps) => {
    const item = items[index];
    const hasPager = items.length > 1;

    useEffect(() => {
        const stepByKey = (event: KeyboardEvent) => {
            // Alt+Left is the browser's Back, Ctrl and Cmd with an arrow move by words or lines elsewhere
            const isShortcut = event.altKey || event.ctrlKey || event.metaKey;

            if (isShortcut) {
                return;
            }

            if (event.key === "ArrowRight") {
                onStep(1);
            }

            if (event.key === "ArrowLeft") {
                onStep(-1);
            }
        };

        document.addEventListener("keydown", stepByKey);

        return () => {
            document.removeEventListener("keydown", stepByKey);
        };
    }, [onStep]);

    if (!item) {
        return null;
    }

    return (
        <>
            <WindowBar title={item.name} compact>
                <button
                    type="button"
                    className={styles.viewer__close}
                    aria-label={labels.close}
                    onClick={onClose}
                >
                    <Close />
                </button>
            </WindowBar>
            <div className={styles.viewer__stage}>
                <div
                    className={[
                        styles.viewer__image,
                        item.kind === "certificate"
                            ? styles["viewer__image--certificate"]
                            : null,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {item.image ? (
                        <Image
                            className={styles.viewer__picture}
                            src={item.image.src}
                            width={item.image.width}
                            height={item.image.height}
                            alt={item.image.alt}
                            sizes={IMAGE_SIZES.viewer}
                        />
                    ) : (
                        <Placeholder label={placeholderLabel(item.name)} />
                    )}
                </div>
            </div>
            <div className={styles.viewer__foot}>
                <div className={styles.viewer__caption} aria-live="polite">
                    <p id={titleId} className={styles.viewer__title}>
                        {item.title}
                    </p>
                    {item.meta === null ? null : (
                        <p className={styles.viewer__meta}>{item.meta}</p>
                    )}
                </div>
                {item.verifyHref === null && !hasPager ? null : (
                    <div className={styles.viewer__actions}>
                        {item.verifyHref === null ? null : (
                            <TextLink
                                href={item.verifyHref}
                                externalHint={labels.externalHint}
                            >
                                {labels.verify}
                            </TextLink>
                        )}
                        {hasPager ? (
                            <div className={styles.viewer__pager}>
                                <button
                                    type="button"
                                    className={styles.viewer__step}
                                    aria-label={labels.previous}
                                    onClick={() => {
                                        onStep(-1);
                                    }}
                                >
                                    <ArrowLeft />
                                </button>
                                <span>{`${String(index + 1)} ${GLYPHS.counter} ${String(items.length)}`}</span>
                                <button
                                    type="button"
                                    className={styles.viewer__step}
                                    aria-label={labels.next}
                                    onClick={() => {
                                        onStep(1);
                                    }}
                                >
                                    <ArrowRight />
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </>
    );
};
