import type { ContentSource } from "types/content";

import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";
import { assertValidContent, validateContent } from "i18n/validate";

import { contentSource } from "test/fixtures/content";

const MISSING_FILE = "/images/missing.webp";
const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;
const files = { exists: (publicPath: string) => publicPath !== MISSING_FILE };

const issuePaths = (source: ContentSource) =>
    validateContent(source, files).map((issue) => issue.path);

const withTagline = (tagline: string): ContentSource => ({
    ...contentSource,
    hero: {
        ...contentSource.hero,
        tagline: { ...contentSource.hero.tagline, [locale]: tagline },
    },
});

describe("validateContent", () => {
    it("should find nothing wrong in a clean source", () => {
        expect(validateContent(contentSource, files)).toEqual([]);
    });

    it("should report an empty text in one language", () => {
        expect(issuePaths(withTagline(" "))).toEqual([
            `hero.tagline.${locale}`,
        ]);
    });

    it("should report broken markup with the text it is in", () => {
        const [issue] = validateContent(withTagline("an **open"), files);

        expect(issue?.path).toBe(`hero.tagline.${locale}`);
        expect(issue?.message).toContain("an **open");
    });

    it.each(["by [Sam](@nobody)", "see [it](http://example.com)"])(
        "should report the link in %s",
        (tagline) => {
            expect(issuePaths(withTagline(tagline))).toEqual([
                `hero.tagline.${locale}`,
            ]);
        },
    );

    it("should report a text with a language that is not configured", () => {
        const source = {
            ...contentSource,
            hero: {
                ...contentSource.hero,
                sub: { ...contentSource.hero.sub, [`${locale}x`]: "extra" },
            },
        };

        expect(issuePaths(source)).toEqual(["hero.sub"]);
    });

    it("should report an unsafe link address", () => {
        const source = {
            ...contentSource,
            profile: {
                ...contentSource.profile,
                links: [
                    { id: "site", label: "Site", href: "http://example.com" },
                ],
            },
        };

        expect(issuePaths(source)).toEqual(["profile.links[0].href"]);
    });

    it("should report an unsafe address in the refs", () => {
        const source = {
            ...contentSource,
            projects: {
                ...contentSource.projects,
                items: contentSource.projects.items.map((item) => ({
                    ...item,
                    refs: { sam: "http://example.com/sam" },
                })),
            },
        };

        expect(issuePaths(source)).toContain("projects.items[0].refs.sam");
    });

    it.each([MISSING_FILE, "images/example-home.webp", "/images/../../secret"])(
        "should report the file %s",
        (src) => {
            const source = {
                ...contentSource,
                projects: {
                    ...contentSource.projects,
                    items: contentSource.projects.items.map((item) => ({
                        ...item,
                        screenshots: item.screenshots.map((shot) =>
                            shot.image
                                ? {
                                      ...shot,
                                      image: { ...shot.image, src },
                                  }
                                : shot,
                        ),
                    })),
                },
            };

            expect(issuePaths(source)).toEqual([
                "projects.items[0].screenshots[0].image.src",
            ]);
        },
    );

    it("should report a certificate date that is not a month", () => {
        const source = {
            ...contentSource,
            certifications: {
                ...contentSource.certifications,
                items: contentSource.certifications.items.map((item) => ({
                    ...item,
                    date: item.date === null ? null : "May 2024",
                })),
            },
        };

        expect(issuePaths(source)).toEqual(["certifications.items[0].date"]);
    });

    it("should report a section listed twice", () => {
        const source = {
            ...contentSource,
            site: {
                ...contentSource.site,
                sections: [...contentSource.site.sections, "about"],
            },
        } satisfies ContentSource;

        expect(issuePaths(source)).toEqual(["site.sections"]);
    });

    it("should report a button that points at a section not on the page", () => {
        const source = {
            ...contentSource,
            site: {
                ...contentSource.site,
                sections: contentSource.site.sections.filter(
                    (id) => id !== "contact",
                ),
            },
        };

        expect(issuePaths(source)).toEqual(["hero.actions[1].target"]);
    });

    it.each([
        [{ start: "2024-6", end: null }, "experience.entries[0].period.start"],
        [
            { start: "2024-06", end: "2024-13" },
            "experience.entries[0].period.end",
        ],
        [{ start: "2026-05", end: "2024-06" }, "experience.entries[0].period"],
    ])("should report the malformed or reversed period %j", (period, path) => {
        const source = {
            ...contentSource,
            experience: {
                ...contentSource.experience,
                entries: contentSource.experience.entries.map((entry) => ({
                    ...entry,
                    period,
                })),
            },
        };

        expect(issuePaths(source)).toEqual([path]);
    });

    it("should report refs whose keys are the language codes", () => {
        const refs = Object.fromEntries(
            LOCALES.map((code) => [code, "https://example.com"]),
        );
        const source = {
            ...contentSource,
            about: { ...contentSource.about, refs },
        };

        expect(issuePaths(source)).toContain("about.refs");
    });
});

describe("assertValidContent", () => {
    it("should accept a clean source", () => {
        expect(() => {
            assertValidContent(contentSource, files);
        }).not.toThrow();
    });

    it("should throw with every issue listed", () => {
        expect(() => {
            assertValidContent(withTagline(""), files);
        }).toThrow(`hero.tagline.${locale}: empty text`);
    });
});
