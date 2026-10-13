import { resolveSiteUrl } from "config/site";

const ORIGIN = "https://example.com";

describe("resolveSiteUrl", () => {
    it("should throw in a production build without the site address", () => {
        expect(() => resolveSiteUrl({ NODE_ENV: "production" })).toThrow(
            "NEXT_PUBLIC_SITE_URL",
        );
    });

    it("should take the configured address in production", () => {
        expect(
            resolveSiteUrl({
                NEXT_PUBLIC_SITE_URL: ORIGIN,
                NODE_ENV: "production",
            }).href,
        ).toBe(`${ORIGIN}/`);
    });

    it("should accept the origin with a trailing slash", () => {
        expect(
            resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: `${ORIGIN}/` }).href,
        ).toBe(`${ORIGIN}/`);
    });

    it.each([
        "https://example.com/site",
        "https://example.com/?a=1",
        "example",
    ])("should reject %s, which is no origin", (value) => {
        expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: value })).toThrow(
            "NEXT_PUBLIC_SITE_URL takes an origin only",
        );
    });

    it("should fall back to the local address outside production", () => {
        expect(resolveSiteUrl({ NODE_ENV: "development" }).href).toBe(
            "http://localhost:3000/",
        );
    });
});
