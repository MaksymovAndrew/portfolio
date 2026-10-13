import { parseInline } from "utils/inline";
import { wordBoxes } from "utils/wordBoxes";

describe("wordBoxes", () => {
    it("should give every word its own box with its accent", () => {
        expect(wordBoxes(parseInline("I build *fast* apps"))).toEqual([
            [{ text: "I", accent: false }],
            [{ text: "build", accent: false }],
            [{ text: "fast", accent: true }],
            [{ text: "apps", accent: false }],
        ]);
    });

    it("should keep punctuation after an accent in the same box", () => {
        expect(wordBoxes(parseInline("*fast*, tested"))).toEqual([
            [
                { text: "fast", accent: true },
                { text: ",", accent: false },
            ],
            [{ text: "tested", accent: false }],
        ]);
    });

    it("should keep an accent inside a word in one box", () => {
        expect(wordBoxes(parseInline("pre*fix* here"))).toEqual([
            [
                { text: "pre", accent: false },
                { text: "fix", accent: true },
            ],
            [{ text: "here", accent: false }],
        ]);
    });
});
