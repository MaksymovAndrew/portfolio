import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { Footer } from "components/layout/Footer";

import { content } from "test/fixtures/content";

describe("Footer", () => {
    it("should credit the person by name", () => {
        render(<Footer content={content} />);

        expect(
            screen.getByText(`Designed & built by ${content.profile.name}`),
        ).toBeInTheDocument();
    });

    it("should show the version and the stack", () => {
        render(<Footer content={content} />);

        expect(
            screen.getByText(
                [
                    `v${process.env.APP_VERSION}`,
                    ...content.site.footerStack,
                ].join(` ${GLYPHS.separator} `),
            ),
        ).toBeInTheDocument();
    });
});
