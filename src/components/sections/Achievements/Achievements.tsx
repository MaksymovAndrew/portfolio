import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { RichText } from "components/ui/RichText";
import { WindowBar } from "components/ui/WindowBar";

import styles from "./Achievements.module.scss";

export interface AchievementsProps {
    content: Content;
}

export const Achievements = ({ content }: AchievementsProps) => {
    const { achievements, ui } = content;

    return (
        <Section id="achievements" label={achievements.label}>
            <div className={styles.achievements}>
                <WindowBar title={achievements.fileName} />
                <ul className={styles.achievements__list}>
                    {achievements.items.map((item) => (
                        <li key={item} className={styles.achievements__item}>
                            <span>
                                <RichText
                                    text={item}
                                    externalHint={ui.external}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
};
