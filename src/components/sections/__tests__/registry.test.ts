import type { SectionRegistry } from "components/sections/registry";
import { pickSections } from "components/sections/registry";

const About = () => null;
const Contact = () => null;

const registry: SectionRegistry = { about: About, contact: Contact };

describe("pickSections", () => {
    it("should keep the configured order", () => {
        expect(pickSections(["contact", "about"], registry)).toEqual([
            { id: "contact", Component: Contact },
            { id: "about", Component: About },
        ]);
    });

    it("should skip a section that has no component yet", () => {
        expect(
            pickSections(["about", "projects", "contact"], registry).map(
                ({ id }) => id,
            ),
        ).toEqual(["about", "contact"]);
    });
});
