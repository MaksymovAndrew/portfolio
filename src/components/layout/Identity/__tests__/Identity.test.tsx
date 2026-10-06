import { render, screen } from "@testing-library/react";

import { Identity } from "components/layout/Identity";

import { content } from "test/fixtures/content";

const { hero, profile, ui } = content;

describe("Identity", () => {
    it("should show the name as the main heading in the left column", () => {
        render(
            <Identity
                place="sidebar"
                eyebrow={hero.eyebrow}
                name={profile.name}
                tagline={hero.tagline}
                externalHint={ui.external}
            />,
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            profile.name,
        );
    });

    it("should show the name as the main heading in the hero", () => {
        render(
            <Identity
                place="hero"
                eyebrow={hero.eyebrow}
                name={profile.name}
                tagline={hero.tagline}
                externalHint={ui.external}
            />,
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            profile.name,
        );
        expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
        expect(screen.getByRole("emphasis")).toHaveTextContent("fast");
    });
});
