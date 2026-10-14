// Prints the notes of one version from CHANGELOG.md, the body of its GitHub Release.
import { readFileSync } from "node:fs";

const CHANGELOG_FILE = "CHANGELOG.md";
const SECTION_HEADING = /^## /;
const USAGE = "Usage: node scripts/release-notes.mjs <version>";

const fail = (message) => {
    console.error(message);
    process.exit(1);
};

const [, , versionArgument] = process.argv;

if (!versionArgument) {
    fail(USAGE);
}

// a tag such as v1.2.0 names the same section as 1.2.0
const version = versionArgument.replace(/^v(?=\d)/, "");
const lines = readFileSync(CHANGELOG_FILE, "utf8").split(/\r?\n/);
const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));

if (start === -1) {
    fail(`${CHANGELOG_FILE} has no section for ${version}`);
}

const end = lines.findIndex(
    (line, index) => index > start && SECTION_HEADING.test(line),
);
const notes = lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join("\n")
    .trim();

if (!notes) {
    fail(`The ${version} section of ${CHANGELOG_FILE} is empty`);
}

console.log(notes);
