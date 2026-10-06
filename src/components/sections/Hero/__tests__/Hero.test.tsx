import { render, screen } from "@testing-library/react";

import { Hero } from "components/sections/Hero";

import { content } from "test/fixtures/content";

const { hero } = content;

describe("Hero", () => {
    it("should link each action to its section", () => {
        render(<Hero content={content} />);

        for (const action of hero.actions) {
            expect(
                screen.getByRole("link", { name: action.label }),
            ).toHaveAttribute("href", `#${action.target}`);
        }
    });

    it("should render every chip", () => {
        render(<Hero content={content} />);

        for (const chip of hero.chips) {
            expect(screen.getByText(chip)).toBeInTheDocument();
        }
    });

    it("should mark the tagline accent", () => {
        render(<Hero content={content} />);

        expect(screen.getByRole("emphasis")).toHaveTextContent("fast");
    });

    it("should show the name and the summary", () => {
        render(<Hero content={content} />);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            content.profile.name,
        );
        expect(screen.getByText(hero.sub)).toBeInTheDocument();
    });
});
