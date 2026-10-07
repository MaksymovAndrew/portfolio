import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { BulletList } from "components/ui/BulletList";
import { Entry } from "components/ui/Entry";
import { TagList } from "components/ui/TagList";

import { formatPeriod } from "utils/formatPeriod";

import styles from "./Experience.module.scss";

export interface ExperienceProps {
    content: Content;
}

export const Experience = ({ content }: ExperienceProps) => {
    const { experience, locale, ui } = content;

    return (
        <Section id="experience" label={experience.label}>
            {experience.entries.map((entry) => (
                <Entry
                    key={`${entry.organisation} ${entry.period.start}`}
                    title={entry.role}
                    period={formatPeriod(entry.period, locale, ui.present)}
                    organisation={entry.organisation}
                    meta={entry.meta}
                >
                    <p className={styles.experience__text}>{entry.text}</p>
                    <BulletList
                        className={styles.experience__bullets}
                        items={entry.bullets}
                        externalHint={ui.external}
                    />
                    <TagList tags={entry.tags} />
                </Entry>
            ))}
        </Section>
    );
};
