import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { Education } from "components/sections/Education";

import { formatPeriod } from "utils/formatPeriod";

import { content } from "test/fixtures/content";

const { education, locale, ui } = content;

type EducationEntry = (typeof education.entries)[number];

// the period as the section prints it; an entry without one prints nothing
const periodOf = (entry: EducationEntry) =>
    entry.period === null ? "" : formatPeriod(entry.period, locale, ui.present);

describe("Education", () => {
    it("should head the section with its label", () => {
        render(<Education content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "education",
        );
    });

    it("should show the field and the period", () => {
        render(<Education content={content} />);

        for (const entry of education.entries) {
            expect(
                screen.getByRole("heading", { level: 3, name: entry.field }),
            ).toBeInTheDocument();
            expect(screen.getByText(periodOf(entry))).toBeInTheDocument();
        }
    });

    it("should leave out the period of an entry without one", () => {
        const entries = education.entries.map((entry) => ({
            ...entry,
            period: null,
        }));

        render(
            <Education
                content={{ ...content, education: { ...education, entries } }}
            />,
        );

        for (const entry of education.entries) {
            expect(
                screen.getByRole("heading", { level: 3, name: entry.field }),
            ).toBeInTheDocument();
            expect(() => screen.getByText(periodOf(entry))).toThrow();
        }
    });

    it("should show faculty and degree on the second line", () => {
        render(<Education content={content} />);

        for (const entry of education.entries) {
            const line = screen.getByText(
                `${entry.faculty} ${GLYPHS.separator} ${entry.degree}`,
            );

            // the organisation leads the paragraph that holds the second line
            expect(line).toHaveTextContent(
                `${entry.organisation}${entry.faculty}`,
            );
        }
    });
});
