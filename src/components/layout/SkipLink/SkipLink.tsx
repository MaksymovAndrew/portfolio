import styles from "./SkipLink.module.scss";

export interface SkipLinkProps {
    targetId: string;
    label: string;
}

export const SkipLink = ({ targetId, label }: SkipLinkProps) => (
    <a href={`#${targetId}`} className={styles["skip-link"]}>
        {label}
    </a>
);
