import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { About } from "components/sections/About";

import { content } from "test/fixtures/content";

const { about, ui } = content;

const withPerson = (
    paragraphs: readonly string[],
    languages: typeof content.profile.languages,
) => ({
    ...content,
    about: { ...about, paragraphs },
    profile: { ...content.profile, languages },
});

describe("About", () => {
    it("should head the section with its label", () => {
        render(<About content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "about",
        );
    });

    it("should render every paragraph with its emphasis", () => {
        render(<About content={content} />);

        expect(screen.getByRole("strong")).toHaveTextContent("Jane");
        expect(
            screen.getByRole("link", { name: `Sam ${ui.external}` }),
        ).toHaveAttribute("href", about.refs.sam);
    });

    it("should build the languages line from the profile", () => {
        render(<About content={content} />);

        expect(
            screen.getByText(`English C2 ${GLYPHS.separator} German B2`),
        ).toBeInTheDocument();
    });

    it("should leave the languages line out when the profile lists none", () => {
        render(<About content={withPerson(["Hi, I am Jane."], [])} />);

        // a second paragraph, even an empty one, would make the query fail
        expect(screen.getByRole("paragraph")).toHaveTextContent(
            "Hi, I am Jane.",
        );
    });
});
