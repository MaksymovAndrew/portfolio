import { SITE_URL } from "config/site";

import robots from "app/robots";

describe("robots", () => {
    it("should let every crawler read the whole site", () => {
        expect(robots().rules).toEqual({ userAgent: "*", allow: "/" });
    });

    it("should name the sitemap by its absolute address", () => {
        expect(robots().sitemap).toBe(new URL("/sitemap.xml", SITE_URL).href);
    });
});
