import { render, screen } from "@testing-library/react";

import { Contact } from "components/sections/Contact";

import { content } from "test/fixtures/content";

const { contact, profile, ui } = content;

const [local, domain] = profile.email.split("@");

describe("Contact", () => {
    it("should head the section with its label", () => {
        render(<Contact content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "get in touch",
        );
    });

    it("should show the heading and the text", () => {
        render(<Contact content={content} />);

        expect(
            screen.getByRole("heading", { level: 3, name: contact.heading }),
        ).toBeInTheDocument();
        expect(screen.getByText(contact.text)).toBeInTheDocument();
    });

    // by its text: jsdom names a link across <wbr> with a space, browsers do not
    it("should link the address with mailto", () => {
        render(<Contact content={content} />);

        expect(screen.getByText(profile.email)).toHaveAttribute(
            "href",
            `mailto:${profile.email}`,
        );
    });

    it("should allow a break only before the at sign", () => {
        render(<Contact content={content} />);

        expect(screen.getByText(profile.email).innerHTML).toBe(
            `${local ?? ""}<wbr>@${domain ?? ""}`,
        );
    });

    it("should keep an address without an at sign whole", () => {
        render(
            <Contact
                content={{ ...content, profile: { ...profile, email: "jane" } }}
            />,
        );

        expect(screen.getByRole("link", { name: "jane" }).innerHTML).toBe(
            "jane",
        );
    });

    it("should offer to copy the address", () => {
        render(<Contact content={content} />);

        expect(
            screen.getByRole("button", { name: ui.copy.label }),
        ).toBeInTheDocument();
    });

    it("should render every social link", () => {
        render(<Contact content={content} />);

        for (const link of profile.links) {
            const element = screen.getByRole("link", {
                name: `${link.label} ${ui.external}`,
            });

            expect(element).toHaveAttribute("href", link.href);
            expect(element).toHaveAttribute("target", "_blank");
        }
    });

    it("should offer the CV as a download", () => {
        render(<Contact content={content} />);

        expect(
            screen.getByRole("link", { name: profile.cv?.label }),
        ).toHaveAttribute("download");
    });

    it("should leave the CV out while there is none", () => {
        render(
            <Contact
                content={{ ...content, profile: { ...profile, cv: null } }}
            />,
        );

        expect(() =>
            screen.getByRole("link", { name: profile.cv?.label }),
        ).toThrow();
    });
});
