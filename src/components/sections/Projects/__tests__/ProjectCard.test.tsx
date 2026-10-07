import { fireEvent, render, screen } from "@testing-library/react";

import { ProjectCard } from "components/sections/Projects/ProjectCard";
import type { ViewerLabels } from "components/ui/Viewer";

import { format } from "utils/inline";
import { placeholderLabel } from "utils/placeholderLabel";

import { content } from "test/fixtures/content";

const { certifications, projects, ui } = content;

const viewerLabels: ViewerLabels = {
    close: ui.close,
    previous: ui.viewer.previous,
    next: ui.viewer.next,
    verify: certifications.verifyLabel,
    externalHint: ui.external,
};

const renderCards = (items: typeof projects.items) =>
    items.map((project) =>
        render(
            <ProjectCard
                project={project}
                ui={ui}
                viewerLabels={viewerLabels}
            />,
        ),
    );

const screenshots = projects.items.flatMap((project) => project.screenshots);

const thumbnailLabel = (index: number) =>
    format(ui.viewer.openScreenshot, { index: String(index + 1) });

describe("ProjectCard", () => {
    it("should show the title and the status", () => {
        renderCards(projects.items);

        for (const project of projects.items) {
            expect(
                screen.getByRole("heading", { level: 3, name: project.title }),
            ).toBeInTheDocument();
            expect(screen.getByText(project.status)).toBeInTheDocument();
            expect(screen.getByText(project.description)).toBeInTheDocument();
        }
    });

    it("should render the story link from its refs", () => {
        renderCards(projects.items);

        expect(
            screen.getByRole("link", { name: `Sam ${ui.external}` }),
        ).toHaveAttribute("href", projects.items[0]?.refs.sam);
    });

    it("should name each thumbnail from the content", () => {
        renderCards(projects.items);

        for (const index of screenshots.keys()) {
            expect(
                screen.getByRole("button", { name: thumbnailLabel(index) }),
            ).toBeInTheDocument();
        }
    });

    it("should open the viewer on the chosen screenshot", () => {
        renderCards(projects.items);

        fireEvent.click(
            screen.getByRole("button", { name: thumbnailLabel(1) }),
        );

        expect(
            screen.getByRole("dialog", { name: screenshots[1]?.caption }),
        ).toHaveTextContent(screenshots[1]?.name ?? "");
    });

    it("should show a placeholder for a screenshot without an image", () => {
        renderCards(projects.items);

        expect(
            screen.getByRole("button", { name: thumbnailLabel(1) }),
        ).toHaveTextContent(placeholderLabel(screenshots[1]?.name ?? ""));
    });

    it("should list the facts with their emphasis and the technologies", () => {
        renderCards(projects.items);

        expect(screen.getByRole("strong")).toHaveTextContent("100+ tests");

        for (const tag of projects.items.flatMap(({ tags }) => tags)) {
            expect(screen.getByText(tag)).toBeInTheDocument();
        }
    });

    it("should render both links", () => {
        renderCards(projects.items);

        for (const link of projects.items.flatMap(({ links }) => links)) {
            const element = screen.getByRole("link", {
                name: `${link.label} ${ui.external}`,
            });

            expect(element).toHaveAttribute("href", link.href);
            expect(element).toHaveAttribute("target", "_blank");
        }
    });

    it("should leave out the links of a project without any", () => {
        renderCards(
            projects.items.map((project) => ({ ...project, links: [] })),
        );

        for (const link of projects.items.flatMap(({ links }) => links)) {
            expect(() =>
                screen.getByRole("link", {
                    name: `${link.label} ${ui.external}`,
                }),
            ).toThrow();
        }
    });

    it("should leave out the thumbnails of a project without screenshots", () => {
        renderCards(
            projects.items.map((project) => ({ ...project, screenshots: [] })),
        );

        expect(() =>
            screen.getByRole("button", { name: thumbnailLabel(0) }),
        ).toThrow();
    });
});
