import type { Refs } from "types/content";

import { foldContent } from "i18n/fold";
import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";

const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;

const localized = (text: string) =>
    Object.fromEntries(LOCALES.map((code) => [code, `${text} ${code}`]));

describe("foldContent", () => {
    it("should fold every localized text to the given language", () => {
        const source = {
            title: localized("Title"),
            nested: { text: localized("Text") },
        };

        expect(foldContent(source, locale)).toEqual({
            title: `Title ${locale}`,
            nested: { text: `Text ${locale}` },
        });
    });

    it("should fold the items of a list", () => {
        const source = { items: [localized("First"), localized("Second")] };

        expect(foldContent(source, locale)).toEqual({
            items: [`First ${locale}`, `Second ${locale}`],
        });
    });

    it("should keep plain strings, numbers, lists of strings and null", () => {
        const source = {
            name: "Jane Example",
            width: 640,
            image: null,
            tags: ["React", "TypeScript"],
        };

        expect(foldContent(source, locale)).toEqual(source);
    });

    it("should keep a refs object as it is", () => {
        const refs: Refs = { jane: "https://example.com/jane" };

        expect(foldContent({ refs }, locale).refs.jane).toBe(refs.jane);
    });
});
