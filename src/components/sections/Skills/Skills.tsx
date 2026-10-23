import type { Content, SectionId } from "types/content";

import { SectionLabel } from "components/ui/SectionLabel";

import styles from "./Skills.module.scss";

export interface SkillsProps {
    content: Content;
}

const ID: SectionId = "skills";

interface TrackProps {
    tokens: readonly string[];
    hidden: boolean;
}

const Track = ({ tokens, hidden }: TrackProps) => (
    <ul className={styles.skills__track} aria-hidden={hidden || undefined}>
        {tokens.map((token) => (
            <li key={token} className={styles.skills__token}>
                {token}
            </li>
        ))}
    </ul>
);

// a band with its own spacing, untitled unless the content gives it a label; the second track makes the loop seamless
export const Skills = ({ content }: SkillsProps) => (
    <section id={ID} className={styles.skills}>
        {content.skills.label === null ? null : (
            <SectionLabel>{content.skills.label}</SectionLabel>
        )}
        {content.skills.rows.map((tokens) => (
            <div key={tokens.join()} className={styles.skills__row}>
                <Track tokens={tokens} hidden={false} />
                <Track tokens={tokens} hidden />
            </div>
        ))}
    </section>
);
