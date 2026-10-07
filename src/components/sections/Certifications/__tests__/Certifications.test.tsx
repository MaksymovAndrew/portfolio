import { fireEvent, render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { Certifications } from "components/sections/Certifications";

import { formatMonth } from "utils/formatPeriod";
import { format } from "utils/inline";
import { placeholderLabel } from "utils/placeholderLabel";

import { content } from "test/fixtures/content";

const { certifications, locale, ui } = content;

// the fixture's certificates: the first has every detail, the second only a title and an issuer
const [full, bare] = certifications.items;

const thumbnailLabel = (title = "") =>
    format(ui.viewer.openCertificate, { title });

const verifyName = `${certifications.verifyLabel} ${ui.external}`;

describe("Certifications", () => {
    it("should head the section with its label", () => {
        render(<Certifications content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "certifications",
        );
    });

    it("should list every certificate with issuer and date", () => {
        render(<Certifications content={content} />);

        for (const item of certifications.items) {
            expect(
                screen.getByRole("heading", { level: 3, name: item.title }),
            ).toBeInTheDocument();
        }
        expect(
            screen.getByText(
                `${full?.issuer ?? ""} ${GLYPHS.separator} ${formatMonth(full?.date ?? "", locale)}`,
            ),
        ).toBeInTheDocument();
    });

    it("should omit the date and the link when they are unknown", () => {
        render(<Certifications content={content} />);

        expect(screen.getByText(bare?.issuer ?? "")).toBeInTheDocument();
        // a second link would make the query throw
        expect(screen.getByRole("link", { name: verifyName })).toHaveAttribute(
            "href",
            full?.verifyHref,
        );
    });

    it("should open the certificate in the viewer with its Verify link", () => {
        render(<Certifications content={content} />);

        fireEvent.click(
            screen.getByRole("button", { name: thumbnailLabel(full?.title) }),
        );

        const dialog = screen.getByRole("dialog", { name: full?.title });

        expect(dialog).toHaveTextContent(full?.name ?? "");
        expect(dialog).toHaveTextContent(certifications.verifyLabel);
    });

    it("should show the credential id in the viewer", () => {
        render(<Certifications content={content} />);

        fireEvent.click(
            screen.getByRole("button", { name: thumbnailLabel(full?.title) }),
        );

        expect(
            screen.getByRole("dialog", { name: full?.title }),
        ).toHaveTextContent(
            format(certifications.credentialLabel, {
                id: full?.credentialId ?? "",
            }),
        );
    });

    it("should leave the unknown parts out of the viewer", () => {
        render(<Certifications content={content} />);

        fireEvent.click(
            screen.getByRole("button", { name: thumbnailLabel(bare?.title) }),
        );

        const dialog = screen.getByRole("dialog", { name: bare?.title });

        // no date, no id and no separator left behind; no Verify link
        expect(dialog).toHaveTextContent(bare?.issuer ?? "");
        expect(dialog).not.toHaveTextContent(GLYPHS.separator);
        expect(dialog).not.toHaveTextContent(certifications.verifyLabel);
    });

    it("should leave out the list when there are no certificates", () => {
        render(
            <Certifications
                content={{
                    ...content,
                    certifications: { ...certifications, items: [] },
                }}
            />,
        );

        expect(() => screen.getByRole("list")).toThrow();
    });

    it("should show a placeholder for a certificate without an image", () => {
        render(<Certifications content={content} />);

        expect(
            screen.getByRole("button", { name: thumbnailLabel(bare?.title) }),
        ).toHaveTextContent(placeholderLabel(bare?.name ?? ""));
    });
});
