import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { Experience } from "components/sections/Experience";

import { formatPeriod } from "utils/formatPeriod";

import { content } from "test/fixtures/content";

const { experience, locale, ui } = content;

const withEntries = (
    changes: Partial<(typeof experience.entries)[number]>,
) => ({
    ...content,
    experience: {
        ...experience,
        entries: experience.entries.map((entry) => ({ ...entry, ...changes })),
    },
});

describe("Experience", () => {
    it("should head the section with its label", () => {
        render(<Experience content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "experience",
        );
    });

    it("should show role, period and organisation", () => {
        render(<Experience content={content} />);

        for (const entry of experience.entries) {
            expect(
                screen.getByRole("heading", { level: 3, name: entry.role }),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    formatPeriod(entry.period, locale, ui.present),
                ),
            ).toBeInTheDocument();
            expect(screen.getByText(entry.organisation)).toBeInTheDocument();
            expect(
                screen.getByText(`${GLYPHS.separator} ${entry.meta}`),
            ).toBeInTheDocument();
        }
    });

    it("should show the summary of each entry", () => {
        render(<Experience content={content} />);

        for (const entry of experience.entries) {
            expect(screen.getByText(entry.text)).toBeInTheDocument();
        }
    });

    it("should render the bullets with their emphasis", () => {
        render(<Experience content={content} />);

        expect(screen.getByRole("strong")).toHaveTextContent("checkout");
        expect(screen.getByRole("emphasis")).toHaveTextContent("many");
    });

    it("should list the tags", () => {
        render(<Experience content={content} />);

        for (const tag of experience.entries.flatMap(({ tags }) => tags)) {
            expect(screen.getByText(tag)).toBeInTheDocument();
        }
    });

    it("should leave the lists out of an entry without bullets or tags", () => {
        render(<Experience content={withEntries({ bullets: [], tags: [] })} />);

        expect(() => screen.getByRole("list")).toThrow();
    });
});
