import { render, screen } from "@testing-library/react";

import { Skills } from "components/sections/Skills";

import { content } from "test/fixtures/content";

// the copy that keeps a row seamless is hidden from assistive technology
const HIDDEN_COPY = '[aria-hidden="true"] li';

const withSkills = (skills: Partial<typeof content.skills>) => ({
    ...content,
    skills: { ...content.skills, ...skills },
});

describe("Skills", () => {
    it("should show every skill of every row", () => {
        render(<Skills content={content} />);

        for (const token of content.skills.rows.flat()) {
            expect(
                screen.getByText(token, { ignore: HIDDEN_COPY }),
            ).toBeInTheDocument();
        }
    });

    it("should hide the duplicated track from assistive technology", () => {
        render(<Skills content={withSkills({ rows: [["React", "Jest"]] })} />);

        // two copies on screen, one list for a screen reader
        expect(() => screen.getByText("React")).toThrow(/multiple elements/);
        expect(screen.getByRole("list")).toHaveTextContent("ReactJest");
    });

    it("should stay untitled without a label", () => {
        render(<Skills content={content} />);

        expect(() => screen.getByRole("heading")).toThrow();
    });

    it("should head the band with its label when the content gives one", () => {
        render(<Skills content={withSkills({ label: "stack" })} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "stack",
        );
    });
});
