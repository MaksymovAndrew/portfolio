import { pickSections, SECTIONS } from "components/sections/registry";

describe("pickSections", () => {
    it("should keep the configured order", () => {
        expect(pickSections(["contact", "about"], SECTIONS)).toEqual([
            { id: "contact", Component: SECTIONS.contact },
            { id: "about", Component: SECTIONS.about },
        ]);
    });

    it("should leave out a section the configuration does not list", () => {
        expect(
            pickSections(["about", "contact"], SECTIONS).map(({ id }) => id),
        ).toEqual(["about", "contact"]);
    });
});
