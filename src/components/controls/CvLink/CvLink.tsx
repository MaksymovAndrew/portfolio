import type { Content } from "types/content";

import { ArrowDown } from "components/icons/ArrowDown";

import styles from "./CvLink.module.scss";

export interface CvLinkProps {
    cv: Content["profile"]["cv"];
}

export const CvLink = ({ cv }: CvLinkProps) =>
    cv ? (
        <a href={cv.href} download className={styles["cv-link"]}>
            {cv.label}
            <ArrowDown className={styles["cv-link__arrow"]} />
        </a>
    ) : null;
