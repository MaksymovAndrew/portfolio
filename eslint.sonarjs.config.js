import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
    includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
    { ignores: ["eslint.config.js", "eslint.sonarjs.config.js"] },
    sonarjs.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
        },
        rules: {
            "sonarjs/cognitive-complexity": "error",
            "sonarjs/no-duplicate-string": "error",
        },
    },
    {
        // command-line tools call git and node by name: no absolute path is the same on every machine
        files: ["scripts/**"],
        rules: {
            "sonarjs/no-os-command-from-path": "off",
        },
    },
    {
        // it misses expect.poll and the shared helpers; playwright/expect-expect in the main config checks this
        files: ["e2e/**"],
        rules: {
            "sonarjs/assertions-in-tests": "off",
        },
    },
];
