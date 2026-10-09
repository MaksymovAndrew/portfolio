import { act, fireEvent, render, screen } from "@testing-library/react";

import { SectionNav } from "components/controls/SectionNav";

import { intersect } from "test/shims/intersectionObserver";

const LABEL = "Sections";

const ITEMS = [
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
] as const;

const Page = ({ onNavigate }: { onNavigate?: (id: string) => void }) => (
    <>
        <SectionNav items={ITEMS} label={LABEL} onNavigate={onNavigate} />
        <section id="about" aria-label="about section" />
        <section id="contact" aria-label="contact section" />
    </>
);

describe("SectionNav", () => {
    it("should link every item to its section", () => {
        render(<Page />);

        expect(
            screen
                .getAllByRole("link")
                .map((link) => [link.textContent, link.getAttribute("href")]),
        ).toEqual([
            ["About", "#about"],
            ["Contact", "#contact"],
        ]);
        expect(
            screen.getByRole("navigation", { name: LABEL }),
        ).toBeInTheDocument();
    });

    it("should mark the current item", () => {
        render(<Page />);
        const contact = screen.getByRole("region", { name: "contact section" });

        act(() => {
            intersect(contact, true);
        });

        expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
            "aria-current",
            "location",
        );
        expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
            "aria-current",
        );
    });

    it("should report a chosen item", () => {
        const onNavigate = jest.fn();

        render(<Page onNavigate={onNavigate} />);
        fireEvent.click(screen.getByRole("link", { name: "About" }));

        expect(onNavigate.mock.calls).toEqual([["about"]]);
    });
});
