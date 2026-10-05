import { fireEvent, render, screen } from "@testing-library/react";

import { ThemeToggle } from "components/controls/ThemeToggle";

import { themeStore } from "utils/themeStore";

import { content } from "test/fixtures/content";

describe("ThemeToggle", () => {
    beforeEach(() => {
        themeStore.set("dark");
    });

    it("should name itself from the content", () => {
        render(<ThemeToggle label={content.ui.theme} />);

        expect(
            screen.getByRole("button", { name: content.ui.theme }),
        ).toBeInTheDocument();
    });

    it("should switch the theme on click", () => {
        render(<ThemeToggle label={content.ui.theme} />);

        fireEvent.click(screen.getByRole("button"));

        expect(document.documentElement.dataset.theme).toBe("light");

        fireEvent.click(screen.getByRole("button"));

        expect(document.documentElement.dataset.theme).toBe("dark");
    });
});
