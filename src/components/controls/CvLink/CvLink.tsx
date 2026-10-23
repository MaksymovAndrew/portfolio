import type { Content } from "types/content";

import { ArrowDown } from "components/icons/ArrowDown";

import { cx } from "utils/cx";

import styles from "./CvLink.module.scss";

export interface CvLinkProps {
    cv: Content["profile"]["cv"];
    variant?: "compact" | "social";
}

// compact beside the theme switch; among the social links it takes their size
export const CvLink = ({ cv, variant = "compact" }: CvLinkProps) =>
    cv ? (
        <a
            href={cv.href}
            download
            className={cx(
                styles["cv-link"],
                variant === "social" ? styles["cv-link--social"] : null,
            )}
        >
            {cv.label}
            <ArrowDown className={styles["cv-link__arrow"]} />
        </a>
    ) : null;
