import styles from "./SectionLabel.module.scss";

export interface SectionLabelProps {
    children: string;
    id?: string;
}

export const SectionLabel = ({ children, id }: SectionLabelProps) => (
    <h2 id={id} className={styles["section-label"]}>
        {children}
    </h2>
);
