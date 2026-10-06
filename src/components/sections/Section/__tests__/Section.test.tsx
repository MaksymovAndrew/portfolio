import { render, screen } from "@testing-library/react";

import { Section } from "components/sections/Section";

describe("Section", () => {
    it("should head the section with its label", () => {
        render(
            <Section id="about" label="about">
                Hi, I am Jane.
            </Section>,
        );

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "about",
        );
    });

    it("should leave the heading out without a label", () => {
        render(
            <Section id="skills" label={null}>
                React, TypeScript
            </Section>,
        );

        expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
        expect(() => screen.getByRole("heading")).toThrow();
    });
});
