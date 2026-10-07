import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { Entry } from "components/ui/Entry";

describe("Entry", () => {
    it("should show the organisation alone when there is no meta", () => {
        render(
            <Entry
                title="Computer Science"
                period="Oct 2017 - Jun 2021"
                organisation="Example University"
                meta={null}
            />,
        );

        const organisation = screen.getByRole("paragraph");

        expect(organisation).toHaveTextContent("Example University");
        expect(organisation).not.toHaveTextContent(GLYPHS.separator);
    });

    it("should put the detail on a line after the organisation", () => {
        render(
            <Entry
                title="Computer Science"
                period="Oct 2017 - Jun 2021"
                organisation="Example University"
                meta={null}
                detail="Faculty of Informatics"
            />,
        );

        expect(screen.getByRole("paragraph").innerHTML).toContain(
            "<b>Example University</b><br>Faculty of Informatics",
        );
    });
});
