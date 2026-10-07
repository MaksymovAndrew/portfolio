import { GLYPHS } from "constants/glyphs";
import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { Entry } from "components/ui/Entry";

import { formatPeriod } from "utils/formatPeriod";

export interface EducationProps {
    content: Content;
}

export const Education = ({ content }: EducationProps) => {
    const { education, locale, ui } = content;

    return (
        <Section id="education" label={education.label}>
            {education.entries.map((entry) => (
                <Entry
                    key={`${entry.organisation} ${entry.period.start}`}
                    title={entry.field}
                    period={formatPeriod(entry.period, locale, ui.present)}
                    organisation={entry.organisation}
                    meta={null}
                    detail={`${entry.faculty} ${GLYPHS.separator} ${entry.degree}`}
                />
            ))}
        </Section>
    );
};
