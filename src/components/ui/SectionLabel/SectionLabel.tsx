import styles from "./SectionLabel.module.scss";

export interface SectionLabelProps {
    children: string;
}

export const SectionLabel = ({ children }: SectionLabelProps) => (
    <h2 className={styles["section-label"]}>{children}</h2>
);
