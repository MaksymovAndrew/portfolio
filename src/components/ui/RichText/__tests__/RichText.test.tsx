import { render, screen } from "@testing-library/react";

import { RichText } from "components/ui/RichText";

const HINT = "(opens in a new tab)";

describe("RichText", () => {
    it("should render bold text as strong", () => {
        render(<RichText text="a **bold** word" externalHint={HINT} />);

        expect(screen.getByRole("strong")).toHaveTextContent("bold");
    });

    it("should render accented text as emphasis", () => {
        render(<RichText text="a *fast* site" externalHint={HINT} />);

        expect(screen.getByRole("emphasis")).toHaveTextContent("fast");
    });

    it("should open an external link in a new tab and say so", () => {
        render(
            <RichText
                text="built with [Jane](@jane)"
                refs={{ jane: "https://example.com/jane" }}
                externalHint={HINT}
            />,
        );

        const link = screen.getByRole("link", { name: `Jane ${HINT}` });

        expect(link).toHaveAttribute("href", "https://example.com/jane");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
    });

    it("should keep an internal link in the same tab", () => {
        render(
            <RichText text="see [contacts](#contact)" externalHint={HINT} />,
        );

        const link = screen.getByRole("link", { name: "contacts" });

        expect(link).toHaveAttribute("href", "#contact");
        expect(link).not.toHaveAttribute("target");
        expect(link).not.toHaveAttribute("rel");
    });

    it("should keep plain text as it is", () => {
        render(<RichText text="snake_case_name" externalHint={HINT} />);

        expect(screen.getByText("snake_case_name")).toBeInTheDocument();
    });
});
