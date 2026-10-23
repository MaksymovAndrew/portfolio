import { IMAGE_SIZES } from "constants/images";

import { useArrowKeys } from "hooks/useArrowKeys";

import { Close } from "components/icons/Close";
import type { PictureProps } from "components/ui/Picture";
import { Picture } from "components/ui/Picture";
import { TextLink } from "components/ui/TextLink";
import { WindowBar } from "components/ui/WindowBar";

import { cx } from "utils/cx";

import styles from "./Viewer.module.scss";
import { ViewerPager } from "./ViewerPager";

export interface ViewerItem {
    kind: "screenshot" | "certificate";
    name: string;
    title: string;
    meta: string | null;
    image: PictureProps["image"];
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

// the inside of the open dialog
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

    useArrowKeys(onStep);

    if (!item) {
        return null;
    }

    return (
        <>
            <WindowBar title={item.name} variant="compact">
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
                    className={cx(
                        styles.viewer__image,
                        item.kind === "certificate"
                            ? styles["viewer__image--certificate"]
                            : null,
                    )}
                >
                    <Picture
                        image={item.image}
                        name={item.name}
                        sizes={IMAGE_SIZES.viewer}
                        className={styles.viewer__picture}
                        decorative={false}
                    />
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
                            <ViewerPager
                                index={index}
                                count={items.length}
                                labels={labels}
                                onStep={onStep}
                            />
                        ) : null}
                    </div>
                )}
            </div>
        </>
    );
};
