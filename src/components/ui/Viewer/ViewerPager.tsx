import { GLYPHS } from "constants/glyphs";

import { ArrowLeft } from "components/icons/ArrowLeft";
import { ArrowRight } from "components/icons/ArrowRight";

import type { ViewerLabels } from "./Viewer";
import styles from "./Viewer.module.scss";

interface ViewerPagerProps {
    index: number;
    count: number;
    labels: Pick<ViewerLabels, "previous" | "next">;
    onStep: (delta: number) => void;
}

export const ViewerPager = ({
    index,
    count,
    labels,
    onStep,
}: ViewerPagerProps) => (
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
        <span>{`${String(index + 1)} ${GLYPHS.counter} ${String(count)}`}</span>
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
);
