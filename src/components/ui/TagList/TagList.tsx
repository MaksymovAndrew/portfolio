import styles from "./TagList.module.scss";

export interface TagListProps {
    tags: readonly string[];
}

export const TagList = ({ tags }: TagListProps) =>
    tags.length === 0 ? null : (
        <ul className={styles["tag-list"]}>
            {tags.map((tag) => (
                <li key={tag} className={styles["tag-list__item"]}>
                    {tag}
                </li>
            ))}
        </ul>
    );
