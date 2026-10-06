import { render, screen } from "@testing-library/react";

import { ButtonLink } from "components/ui/Button";

describe("ButtonLink", () => {
    it("should link to its target", () => {
        render(
            <ButtonLink href="#projects" variant="primary">
                View my work
            </ButtonLink>,
        );

        expect(
            screen.getByRole("link", { name: "View my work" }),
        ).toHaveAttribute("href", "#projects");
    });

    it("should mark a magnetic button for the pointer effects", () => {
        render(
            <ButtonLink href="#contact" variant="ghost" magnetic>
                Get in touch
            </ButtonLink>,
        );

        expect(
            screen.getByRole("link", { name: "Get in touch" }),
        ).toHaveAttribute("data-magnetic");
    });

    it("should leave an ordinary button unmarked", () => {
        render(
            <ButtonLink href="#contact" variant="ghost">
                Get in touch
            </ButtonLink>,
        );

        expect(
            screen.getByRole("link", { name: "Get in touch" }),
        ).not.toHaveAttribute("data-magnetic");
    });
});
