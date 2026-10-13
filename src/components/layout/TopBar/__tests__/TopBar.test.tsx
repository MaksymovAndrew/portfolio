import { render, screen } from "@testing-library/react";

import { TopBar } from "components/layout/TopBar";
import { localePath } from "i18n/paths";

import { content } from "test/fixtures/content";

describe("TopBar", () => {
    it("should offer the menu on a page with sections", () => {
        render(<TopBar content={content} />);

        expect(
            screen.getByRole("button", { name: content.ui.menu.open }),
        ).toBeInTheDocument();
    });

    it("should keep the home link, languages and theme on a system page without a menu", () => {
        render(<TopBar content={content} variant="system" />);

        expect(
            screen.getByRole("link", {
                name: `${content.profile.initials} ${content.profile.name}`,
            }),
        ).toHaveAttribute("href", localePath(content.locale));
        expect(
            screen.getByRole("group", { name: content.ui.languages }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: content.ui.theme }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: content.ui.menu.open }),
        ).not.toBeInTheDocument();
    });
});
