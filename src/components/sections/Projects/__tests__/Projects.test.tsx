import { render, screen } from "@testing-library/react";

import { Projects } from "components/sections/Projects";

import { content } from "test/fixtures/content";

const { projects } = content;

describe("Projects", () => {
    it("should head the section with its label", () => {
        render(<Projects content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "featured project",
        );
    });

    it("should draw a card for every project", () => {
        render(
            <Projects
                content={{
                    ...content,
                    projects: {
                        ...projects,
                        items: projects.items.map((project, index) => ({
                            ...project,
                            title: `Project ${String(index + 1)}`,
                        })),
                    },
                }}
            />,
        );

        projects.items.forEach((project, index) => {
            expect(
                screen.getByRole("heading", {
                    level: 3,
                    name: `Project ${String(index + 1)}`,
                }),
            ).toBeInTheDocument();
        });
    });
});
