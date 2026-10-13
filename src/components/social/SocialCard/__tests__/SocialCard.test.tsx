import { render, screen } from "@testing-library/react";

import { theme } from "theme/theme";

import { SocialCard } from "components/social/SocialCard";

import { toPlainText } from "utils/inline";

import { content } from "test/fixtures/content";

const { hero, profile } = content;
const { palette, tints } = theme.modes.dark;

const renderCard = () =>
    render(
        <SocialCard
            eyebrow={hero.eyebrow}
            name={profile.name}
            tagline={hero.tagline}
            chips={hero.chips}
            initials={profile.initials}
            palette={palette}
            tints={tints}
            glow={theme.glow}
        />,
    );

describe("SocialCard", () => {
    it("should show the name, the tagline and every chip", () => {
        renderCard();

        // the name and the tagline are drawn word by word
        [
            ...profile.name.split(" "),
            ...toPlainText(hero.tagline).split(" "),
        ].forEach((word) => {
            expect(screen.getByText(word)).toBeInTheDocument();
        });
        hero.chips.forEach((chip) => {
            expect(screen.getByText(chip)).toBeInTheDocument();
        });
    });

    it("should mark the eyebrow and the initials", () => {
        renderCard();

        expect(screen.getByText(`// ${hero.eyebrow}`)).toBeInTheDocument();
        expect(screen.getByText(profile.initials)).toHaveTextContent(
            `${profile.initials}.`,
        );
    });
});
