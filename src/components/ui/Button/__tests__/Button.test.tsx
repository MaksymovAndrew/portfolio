import { fireEvent, render, screen } from "@testing-library/react";

import { Button, ButtonLink } from "components/ui/Button";

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

describe("Button", () => {
    it("should run its action on a click", () => {
        const onClick = jest.fn();

        render(
            <Button variant="primary" onClick={onClick}>
                Try again
            </Button>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Try again" }));

        expect(onClick.mock.calls).toHaveLength(1);
    });
});
