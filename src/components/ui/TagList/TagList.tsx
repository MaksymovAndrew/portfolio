import styles from "./TagList.module.scss";

export interface TagListProps {
    tags: readonly string[];
    className?: string;
}

// no outer margin: the parent spaces the list
export const TagList = ({ tags, className }: TagListProps) =>
    tags.length === 0 ? null : (
        <ul
            className={[styles["tag-list"], className]
                .filter(Boolean)
                .join(" ")}
        >
            {tags.map((tag) => (
                <li key={tag} className={styles["tag-list__item"]}>
                    {tag}
                </li>
            ))}
        </ul>
    );
