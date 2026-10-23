// Builds theme/fonts/web/ from the Google Fonts variable sources: only the weights the styles use and every language's letters.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const outDir = path.join(rootDir, "theme", "fonts", "web");
const python =
    process.env.PYTHON ?? (process.platform === "win32" ? "py" : "python3");

const USAGE =
    "Usage: node scripts/web-fonts.mjs <directory holding the three [wght].ttf files from github.com/google/fonts>. Needs Python with fonttools and brotli; PYTHON picks the interpreter.";

// a new language adds its letters here, then the fonts are built again
const UNICODES = [
    "U+0020-007E", // Basic Latin
    "U+00A0-00FF", // Latin-1: accented letters, quotes, the no-break space
    "U+0104-0107,U+0118-0119,U+0141-0144,U+015A-015B,U+0179-017C", // Polish
    "U+02BC,U+0404,U+0406-0407,U+0410-044F,U+0454,U+0456-0457,U+0490-0491", // Ukrainian
    "U+2010-2027,U+2030-203A,U+20AC,U+20B4,U+2116,U+2122", // punctuation and signs
    "U+2190-2199,U+25B8,U+25C7", // arrows and the symbols the page draws
].join(",");

// the weights the styles use; a new weight in a stylesheet widens its range here
const FONTS = [
    { file: "Unbounded[wght].ttf", out: "Unbounded", weights: "600:700" },
    { file: "Manrope[wght].ttf", out: "Manrope", weights: "400:700" },
    {
        file: "JetBrainsMono[wght].ttf",
        out: "JetBrainsMono",
        weights: "400:500",
    },
];

const fail = (message) => {
    console.error(message);
    process.exit(1);
};

const run = (args) => {
    // a fixed timestamp keeps a rebuild of unchanged fonts byte for byte the same
    const result = spawnSync(python, args, {
        stdio: ["ignore", "ignore", "inherit"],
        env: { ...process.env, SOURCE_DATE_EPOCH: "0" },
    });

    if (result.error) {
        fail(`${python} did not start: ${result.error.message}. ${USAGE}`);
    }

    if (result.status !== 0) {
        fail(`${python} ${args.slice(0, 2).join(" ")} failed. ${USAGE}`);
    }
};

const sourcesDir = process.argv[2];

if (!sourcesDir) {
    fail(USAGE);
}

const missing = FONTS.filter(
    ({ file }) => !existsSync(path.join(sourcesDir, file)),
);

if (missing.length > 0) {
    fail(
        `Missing in ${sourcesDir}: ${missing.map(({ file }) => file).join(", ")}. ${USAGE}`,
    );
}

const workDir = mkdtempSync(path.join(tmpdir(), "web-fonts-"));

try {
    for (const { file, out, weights } of FONTS) {
        const instanced = path.join(workDir, `${out}.ttf`);
        const target = path.join(outDir, `${out}.woff2`);

        run([
            "-m",
            "fontTools.varLib.instancer",
            path.join(sourcesDir, file),
            `wght=${weights}`,
            "-q",
            "-o",
            instanced,
        ]);
        run([
            "-m",
            "fontTools.subset",
            instanced,
            `--unicodes=${UNICODES}`,
            "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk",
            "--flavor=woff2",
            `--output-file=${target}`,
        ]);
        console.log(
            `${path.relative(rootDir, target)}: ${Math.round(statSync(target).size / 1024)} KB, weights ${weights}`,
        );
    }
} finally {
    rmSync(workDir, { recursive: true, force: true });
}
