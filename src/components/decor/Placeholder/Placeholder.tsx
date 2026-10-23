import styles from "./Placeholder.module.scss";

export interface PlaceholderProps {
    label: string;
}

// stands in for a missing image; decoration, sized by the box around it
export const Placeholder = ({ label }: PlaceholderProps) => (
    <span className={styles.placeholder} aria-hidden="true">
        <span className={styles.placeholder__label}>{label}</span>
    </span>
);
