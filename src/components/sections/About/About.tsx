import { GLYPHS } from "constants/glyphs";
import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { RichText } from "components/ui/RichText";

import styles from "./About.module.scss";

export interface AboutProps {
    content: Content;
}

export const About = ({ content }: AboutProps) => {
    const { about, profile, ui } = content;

    return (
        <Section id="about" label={about.label}>
            {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.about__paragraph}>
                    <RichText
                        text={paragraph}
                        refs={about.refs}
                        externalHint={ui.external}
                    />
                </p>
            ))}
            {profile.languages.length === 0 ? null : (
                <p className={styles.about__languages}>
                    {profile.languages
                        .map(({ name, level }) => `${name} ${level}`)
                        .join(` ${GLYPHS.separator} `)}
                </p>
            )}
        </Section>
    );
};
