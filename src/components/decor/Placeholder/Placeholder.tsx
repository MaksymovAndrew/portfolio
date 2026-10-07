import styles from "./Placeholder.module.scss";

export interface PlaceholderProps {
    label: string;
}

// stands in for an image that is not there yet; decoration, so the name of the control around it stays its own.
// The box around it sets the size of the label
export const Placeholder = ({ label }: PlaceholderProps) => (
    <span className={styles.placeholder} aria-hidden="true">
        <span className={styles.placeholder__label}>{label}</span>
    </span>
);
