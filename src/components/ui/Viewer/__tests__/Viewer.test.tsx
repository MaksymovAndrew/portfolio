import { fireEvent, render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import type { ViewerItem, ViewerLabels } from "components/ui/Viewer";
import { ViewerRoot, ViewerTrigger } from "components/ui/Viewer";

import { placeholderLabel } from "utils/placeholderLabel";

import { content } from "test/fixtures/content";

const { certifications, projects, ui } = content;

// the fixture's screenshots: the first has an image, the second has none
const screenshots: readonly ViewerItem[] = projects.items.flatMap((project) =>
    project.screenshots.map((shot) => ({
        kind: "screenshot" as const,
        name: shot.name,
        title: shot.caption,
        meta: project.title,
        image: shot.image,
        verifyHref: null,
    })),
);

// the fixture's certificates: the first has a verify link, the second has none
const certificates: readonly ViewerItem[] = certifications.items.map(
    (item) => ({
        kind: "certificate" as const,
        name: item.name,
        title: item.title,
        meta: item.issuer,
        image: item.image,
        verifyHref: item.verifyHref,
    }),
);

const labels: ViewerLabels = {
    close: ui.close,
    previous: ui.viewer.previous,
    next: ui.viewer.next,
    verify: certifications.verifyLabel,
    externalHint: ui.external,
};

const triggerLabel = (index: number) => `Open ${String(index + 1)}`;

const renderViewer = (items: readonly ViewerItem[]) =>
    render(
        <ViewerRoot items={items} labels={labels}>
            {items.map((item, index) => (
                <ViewerTrigger
                    key={item.name}
                    index={index}
                    label={triggerLabel(index)}
                >
                    {item.name}
                </ViewerTrigger>
            ))}
        </ViewerRoot>,
    );

const openAt = (index: number) => {
    fireEvent.click(screen.getByRole("button", { name: triggerLabel(index) }));
};

// the dialog is named by the caption of the item it shows
const shownDialog = (items: readonly ViewerItem[], index: number) =>
    screen.getByRole("dialog", { name: items[index]?.title });

describe("Viewer", () => {
    it("should open on the chosen item", () => {
        renderViewer(screenshots);

        screenshots.forEach((item, index) => {
            openAt(index);

            expect(shownDialog(screenshots, index)).toHaveTextContent(
                item.name,
            );

            fireEvent.click(screen.getByRole("button", { name: labels.close }));

            expect(() => screen.getByRole("dialog")).toThrow();
        });
    });

    it("should step with the arrows and wrap around", () => {
        renderViewer(screenshots);
        openAt(0);

        fireEvent.click(screen.getByRole("button", { name: labels.next }));

        expect(shownDialog(screenshots, 1)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: labels.next }));

        expect(shownDialog(screenshots, 0)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: labels.previous }));

        expect(shownDialog(screenshots, 1)).toBeInTheDocument();
    });

    it("should step with the arrow keys", () => {
        renderViewer(screenshots);
        openAt(0);

        fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });

        expect(shownDialog(screenshots, 1)).toBeInTheDocument();

        fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });

        expect(shownDialog(screenshots, 0)).toBeInTheDocument();
    });

    it("should leave an arrow key with a modifier to the browser", () => {
        renderViewer(screenshots);
        openAt(0);

        fireEvent.keyDown(screen.getByRole("dialog"), {
            key: "ArrowRight",
            altKey: true,
        });

        expect(shownDialog(screenshots, 0)).toBeInTheDocument();
    });

    it("should hand the focus back to the thumbnail it opened from", () => {
        renderViewer(screenshots);
        openAt(1);

        fireEvent.click(screen.getByRole("button", { name: labels.close }));

        expect(
            screen.getByRole("button", { name: triggerLabel(1) }),
        ).toHaveFocus();
    });

    it("should show the counter", () => {
        renderViewer(screenshots);
        openAt(1);

        expect(
            screen.getByText(
                `2 ${GLYPHS.counter} ${String(screenshots.length)}`,
            ),
        ).toBeInTheDocument();
    });

    it("should hide the pager for a single item", () => {
        renderViewer(screenshots.slice(0, 1));
        openAt(0);

        expect(() =>
            screen.getByRole("button", { name: labels.next }),
        ).toThrow();
        expect(() =>
            screen.getByRole("button", { name: labels.previous }),
        ).toThrow();
    });

    it("should show Verify only for an item with a link", () => {
        renderViewer(certificates);
        openAt(0);

        expect(
            screen.getByRole("link", {
                name: `${labels.verify} ${labels.externalHint}`,
            }),
        ).toHaveAttribute("href", certificates[0]?.verifyHref);

        fireEvent.click(screen.getByRole("button", { name: labels.next }));

        expect(() => screen.getByRole("link")).toThrow();
    });

    it("should show the image with its description", () => {
        renderViewer(screenshots);
        openAt(0);

        expect(
            screen.getByRole("img", { name: screenshots[0]?.image?.alt }),
        ).toBeInTheDocument();
    });

    it("should show the placeholder when the item has no image", () => {
        renderViewer(screenshots);
        openAt(1);

        expect(
            screen.getByText(placeholderLabel(screenshots[1]?.name ?? "")),
        ).toBeInTheDocument();
        expect(() => screen.getByRole("img")).toThrow();
    });
});
