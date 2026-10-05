import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { source } from "content";

const SRC = path.join(process.cwd(), "src");
const TEXT_FILE = /\.(?:ts|tsx|scss|json)$/;
const SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

const { name, email, links } = source.profile;
const ownerData = [
    name,
    name.split(" ").at(-1) ?? name,
    email,
    ...links.map((link) => link.href),
];

// a whole word only, so a short name never matches inside a longer one
const asWord = (value: string) =>
    new RegExp(
        `(?<![\\p{L}\\p{N}])${value.replace(SPECIAL_CHARACTERS, "\\$&")}(?![\\p{L}\\p{N}])`,
        "u",
    );

const sourceFiles = readdirSync(SRC, {
    encoding: "utf8",
    recursive: true,
}).filter((file) => TEXT_FILE.test(file));

describe("framework", () => {
    it("should keep the owner's data out of src", () => {
        const leaks = sourceFiles.flatMap((file) => {
            const text = readFileSync(path.join(SRC, file), "utf8");

            return ownerData
                .filter((value) => asWord(value).test(text))
                .map((value) => `${file}: ${value}`);
        });

        expect(leaks).toEqual([]);
    });
});
