import { render, screen } from "@testing-library/react";

import { BulletList } from "components/ui/BulletList";

const HINT = "(opens in a new tab)";

describe("BulletList", () => {
    it("should resolve a link through the refs", () => {
        render(
            <BulletList
                items={["built with [Sam](@sam)"]}
                refs={{ sam: "https://example.com/sam" }}
                externalHint={HINT}
            />,
        );

        expect(
            screen.getByRole("link", { name: `Sam ${HINT}` }),
        ).toHaveAttribute("href", "https://example.com/sam");
    });

    it("should render no list without items", () => {
        render(<BulletList items={[]} externalHint={HINT} />);

        expect(() => screen.getByRole("list")).toThrow();
    });
});
