import { act, fireEvent, render, screen } from "@testing-library/react";

import { MenuSheet } from "components/controls/MenuSheet";

import { intersect } from "test/shims/intersectionObserver";

const LABELS = {
    open: "Open menu",
    title: "menu",
    close: "Close",
    sections: "Sections",
};

const ITEMS = [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
] as const;

const renderMenu = () =>
    render(
        <>
            <MenuSheet items={ITEMS} labels={LABELS}>
                <a href="/cv.pdf">CV</a>
            </MenuSheet>
            <section id="about" tabIndex={-1} aria-label="about section" />
            <section id="contact" tabIndex={-1} aria-label="contact section" />
        </>,
    );

const openMenu = () => {
    fireEvent.click(screen.getByRole("button", { name: LABELS.open }));
};

describe("MenuSheet", () => {
    it("should open from the button", () => {
        renderMenu();
        openMenu();

        const dialog = screen.getByRole("dialog");

        expect(dialog).toHaveAttribute("open");
        expect(screen.getByRole("link", { name: "CV" })).toBeInTheDocument();
    });

    it("should close when an item is chosen", () => {
        renderMenu();
        openMenu();
        fireEvent.click(screen.getByRole("link", { name: "Contact" }));

        expect(
            screen.getByRole("dialog", { hidden: true }),
        ).not.toHaveAttribute("open");
        expect(
            screen.getByRole("region", { name: "contact section" }),
        ).toHaveFocus();
    });

    it("should close from its close button", () => {
        renderMenu();
        openMenu();
        fireEvent.click(screen.getByRole("button", { name: LABELS.close }));

        expect(
            screen.getByRole("dialog", { hidden: true }),
        ).not.toHaveAttribute("open");
    });

    it("should return the focus to the menu button", () => {
        renderMenu();
        openMenu();

        // what the browser does on Escape
        act(() => {
            screen.getByRole<HTMLDialogElement>("dialog").close();
        });

        expect(screen.getByRole("button", { name: LABELS.open })).toHaveFocus();
    });

    it("should mark the current item", () => {
        renderMenu();
        const about = screen.getByRole("region", { name: "about section" });

        openMenu();
        act(() => {
            intersect(about, true);
        });

        expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
            "aria-current",
            "location",
        );
    });

    it("should return a name for the dialog", () => {
        renderMenu();
        openMenu();

        expect(
            screen.getByRole("dialog", { name: LABELS.title }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("navigation", { name: LABELS.sections }),
        ).toBeInTheDocument();
    });
});
