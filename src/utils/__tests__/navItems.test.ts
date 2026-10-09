import { buildNavItems } from "utils/navItems";

import { content } from "test/fixtures/content";

describe("buildNavItems", () => {
    it("should list the sections in the configured order", () => {
        const sections = ["contact", "about", "experience"] as const;

        expect(
            buildNavItems({ ...content, site: { ...content.site, sections } }),
        ).toEqual([
            { id: "contact", label: content.contact.nav },
            { id: "about", label: content.about.nav },
            { id: "experience", label: content.experience.nav },
        ]);
    });

    it("should leave out the sections without a navigation label", () => {
        const sections = ["skills", "about"] as const;

        expect(
            buildNavItems({ ...content, site: { ...content.site, sections } }),
        ).toEqual([{ id: "about", label: content.about.nav }]);
    });
});
