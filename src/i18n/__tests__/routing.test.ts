import { createLocaleRouting } from "i18n/routing";

const config = {
    locales: ["en", "pl", "uk"],
    defaultLocale: "en",
    pages: ["/"],
    notFoundSegment: "not-found",
};

const { resolve } = createLocaleRouting(config);

describe("createLocaleRouting", () => {
    it("should serve the root in the default language", () => {
        expect(resolve("/")).toEqual({ kind: "rewrite", pathname: "/en" });
    });

    it("should serve the other languages under their prefix", () => {
        expect(resolve("/pl")).toEqual({ kind: "pass" });
        expect(resolve("/uk")).toEqual({ kind: "pass" });
    });

    it("should move the default language's prefix to the root", () => {
        expect(resolve("/en")).toEqual({ kind: "redirect", pathname: "/" });
        expect(resolve("/en/anything")).toEqual({
            kind: "redirect",
            pathname: "/anything",
        });
    });

    it("should answer an unknown prefixed address in its language", () => {
        for (const pathname of ["/pl/nope", "/pl/a/b", "/pl/not-found"]) {
            expect(resolve(pathname)).toEqual({
                kind: "notFound",
                pathname: "/pl/not-found",
            });
        }
    });

    it("should answer any other address in the default language", () => {
        for (const pathname of ["/nope", "/a/b", "/PL", "/plx"]) {
            expect(resolve(pathname)).toEqual({
                kind: "notFound",
                pathname: "/en/not-found",
            });
        }
    });

    it("should serve a single language at the root only", () => {
        const single = createLocaleRouting({
            ...config,
            locales: ["de"],
            defaultLocale: "de",
        });

        expect(single.resolve("/")).toEqual({
            kind: "rewrite",
            pathname: "/de",
        });
        expect(single.resolve("/de")).toEqual({
            kind: "redirect",
            pathname: "/",
        });
    });

    it("should follow another default language", () => {
        const polish = createLocaleRouting({ ...config, defaultLocale: "pl" });

        expect(polish.resolve("/")).toEqual({
            kind: "rewrite",
            pathname: "/pl",
        });
        expect(polish.resolve("/en")).toEqual({ kind: "pass" });
    });

    it("should serve every configured page in each language", () => {
        const twoPages = createLocaleRouting({
            ...config,
            pages: ["/", "/cv"],
        });

        expect(twoPages.resolve("/cv")).toEqual({
            kind: "rewrite",
            pathname: "/en/cv",
        });
        expect(twoPages.resolve("/pl/cv")).toEqual({ kind: "pass" });
    });
});
