import {
    format,
    InlineMarkupError,
    isSafeHref,
    parseInline,
    toPlainText,
} from "utils/inline";

describe("parseInline", () => {
    it("should return plain text as one text node", () => {
        expect(parseInline("plain words")).toEqual([
            { type: "text", value: "plain words" },
        ]);
    });

    it("should mark bold text", () => {
        expect(parseInline("a **bold** word")).toEqual([
            { type: "text", value: "a " },
            { type: "strong", value: "bold" },
            { type: "text", value: " word" },
        ]);
    });

    it("should mark accented text", () => {
        expect(parseInline("I build *fast, tested* interfaces")).toEqual([
            { type: "text", value: "I build " },
            { type: "accent", value: "fast, tested" },
            { type: "text", value: " interfaces" },
        ]);
    });

    it("should mark an https link as external", () => {
        expect(parseInline("[the site](https://example.com/jane)")).toEqual([
            {
                type: "link",
                value: "the site",
                href: "https://example.com/jane",
                external: true,
            },
        ]);
    });

    it.each(["#contact", "/cv.pdf", "mailto:jane@example.com"])(
        "should keep the link %s in the same tab",
        (target) => {
            expect(parseInline(`[here](${target})`)).toEqual([
                { type: "link", value: "here", href: target, external: false },
            ]);
        },
    );

    it("should resolve a key through the refs", () => {
        const refs = { jane: "https://example.com/jane" };

        expect(parseInline("with [Jane](@jane)", refs)).toEqual([
            { type: "text", value: "with " },
            {
                type: "link",
                value: "Jane",
                href: refs.jane,
                external: true,
            },
        ]);
    });

    it.each(["@jane", "@toString"])(
        "should throw on the unknown key %s",
        (key) => {
            expect(() => parseInline(`[Jane](${key})`, {})).toThrow(
                "unknown key",
            );
        },
    );

    it.each(["**open", "*open", "[open", "[label]", "[label](target"])(
        "should throw on the unclosed marker in %s",
        (text) => {
            expect(() => parseInline(text)).toThrow(InlineMarkupError);
        },
    );

    it.each([
        "javascript:alert(1)",
        "http://example.com",
        "//example.com",
        String.raw`/\example.com`,
    ])("should throw on the unsafe target %s", (target) => {
        expect(() => parseInline(`[link](${target})`)).toThrow(
            InlineMarkupError,
        );
    });

    it.each([
        "**bold *accent* bold**",
        "*accent **bold** accent*",
        "*a [link](#top)*",
        "****",
    ])("should throw on nested or empty markup in %s", (text) => {
        expect(() => parseInline(text)).toThrow(InlineMarkupError);
    });

    it("should name the text in the error", () => {
        expect(() => parseInline("an **open marker")).toThrow(
            'in "an **open marker"',
        );
    });

    it("should keep escaped markers as text", () => {
        expect(parseInline("2 \\* 3 \\[not a link]")).toEqual([
            { type: "text", value: "2 * 3 [not a link]" },
        ]);
    });

    it("should keep an escaped marker inside bold text", () => {
        expect(parseInline("**2 \\* 3**")).toEqual([
            { type: "strong", value: "2 * 3" },
        ]);
    });

    it("should not close accented text on an escaped asterisk", () => {
        expect(parseInline("*2 \\* 3*")).toEqual([
            { type: "accent", value: "2 * 3" },
        ]);
    });

    it("should throw on a space in a link target", () => {
        expect(() => parseInline("[link](#a b)")).toThrow(InlineMarkupError);
    });

    it("should send a target with parentheses to the refs", () => {
        expect(() =>
            parseInline("[Foo](https://example.com/Foo_(bar))"),
        ).toThrow("refs");
    });

    it("should keep escaped closing brackets in a link label", () => {
        expect(parseInline(String.raw`[a \] b \) c](#top)`)).toEqual([
            { type: "link", value: "a ] b ) c", href: "#top", external: false },
        ]);
    });

    it("should keep underscores in names", () => {
        expect(parseInline("snake_case_name")).toEqual([
            { type: "text", value: "snake_case_name" },
        ]);
    });
});

describe("toPlainText", () => {
    it("should keep the words and drop the markers", () => {
        expect(
            toPlainText("I build *fast* and **tested** UI with [Jane](@jane)"),
        ).toBe("I build fast and tested UI with Jane");
    });
});

describe("isSafeHref", () => {
    it.each(["https://example.com", "mailto:jane@example.com", "#top", "/"])(
        "should accept %s",
        (href) => {
            expect(isSafeHref(href)).toBe(true);
        },
    );

    it.each([
        "http://example.com",
        "javascript:void(0)",
        "//example.com",
        String.raw`/\example.com`,
        "",
    ])("should reject %s", (href) => {
        expect(isSafeHref(href)).toBe(false);
    });
});

describe("format", () => {
    it("should fill the placeholders", () => {
        expect(format("Built by {name}", { name: "Jane" })).toBe(
            "Built by Jane",
        );
    });

    it("should throw on a missing value", () => {
        expect(() => format("Built by {name}", {})).toThrow("{name}");
    });
});
