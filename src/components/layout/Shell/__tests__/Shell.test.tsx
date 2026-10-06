import { render, screen } from "@testing-library/react";

import { Shell } from "components/layout/Shell";
import { localePath } from "i18n/paths";

import { content } from "test/fixtures/content";

describe("Shell", () => {
    it("should point the skip link at the main content", () => {
        render(<Shell content={content}>Main content</Shell>);

        const main = screen.getByRole("main");

        expect(main).toHaveTextContent("Main content");
        expect(main).toHaveAttribute("tabindex", "-1");
        expect(
            screen.getByRole("link", { name: content.ui.skipToContent }),
        ).toHaveAttribute("href", `#${main.id}`);
    });

    it("should give the top bar a home link named after the person", () => {
        render(<Shell content={content}>Main content</Shell>);

        expect(
            screen.getByRole("banner", { name: content.ui.topBar }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", {
                name: `${content.profile.initials} ${content.profile.name}`,
            }),
        ).toHaveAttribute("href", localePath(content.locale));
    });

    it("should close the page with the footer", () => {
        render(<Shell content={content}>Main content</Shell>);

        expect(screen.getByRole("contentinfo")).toHaveTextContent(
            content.profile.name,
        );
    });
});
