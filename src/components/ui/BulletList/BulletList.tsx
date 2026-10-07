import type { Refs } from "types/content";

import { RichText } from "components/ui/RichText";

import styles from "./BulletList.module.scss";

export interface BulletListProps {
    items: readonly string[];
    refs?: Refs;
    externalHint: string;
    className?: string;
}

// no outer margin: the parent spaces the list; the span keeps the rich text one flex item next to the marker
export const BulletList = ({
    items,
    refs,
    externalHint,
    className,
}: BulletListProps) =>
    items.length === 0 ? null : (
        <ul
            className={[styles["bullet-list"], className]
                .filter(Boolean)
                .join(" ")}
        >
            {items.map((item) => (
                <li key={item} className={styles["bullet-list__item"]}>
                    <span>
                        <RichText
                            text={item}
                            refs={refs}
                            externalHint={externalHint}
                        />
                    </span>
                </li>
            ))}
        </ul>
    );
