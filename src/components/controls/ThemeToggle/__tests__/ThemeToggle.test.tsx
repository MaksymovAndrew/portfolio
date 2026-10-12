import { fireEvent, render, screen } from "@testing-library/react";

import { ThemeToggle } from "components/controls/ThemeToggle";

import { themeStore } from "utils/themeStore";

import { content } from "test/fixtures/content";
import { enableViewTransitions } from "test/shims/viewTransition";

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

    it("should grow the new theme from the pointer", () => {
        enableViewTransitions();
        render(<ThemeToggle label={content.ui.theme} />);

        fireEvent.click(screen.getByRole("button"), {
            detail: 1,
            clientX: 12,
            clientY: 34,
        });
        const root = document.documentElement;

        expect(root.dataset.theme).toBe("light");
        expect(root.dataset.vt).toBe("circle");
        expect(root.style.getPropertyValue("--vt-x")).toBe("12px");
        expect(root.style.getPropertyValue("--vt-y")).toBe("34px");
    });
});
