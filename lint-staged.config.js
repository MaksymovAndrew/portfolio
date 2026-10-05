import path from "node:path";

// Windows caps a command line at ~8k characters, so a large commit runs in batches
const BATCH_SIZE = 30;

const rootDir = import.meta.dirname;

const inBatches = (files) => {
    const batches = [];

    for (let index = 0; index < files.length; index += BATCH_SIZE) {
        batches.push(
            files
                .slice(index, index + BATCH_SIZE)
                .map(
                    (file) =>
                        `"${path.relative(rootDir, file).replaceAll("\\", "/")}"`,
                )
                .join(" "),
        );
    }

    return batches;
};

const commands =
    (...tools) =>
    (files) =>
        tools.flatMap((tool) =>
            inBatches(files).map((batch) => `${tool} ${batch}`),
        );

export default {
    "*.{ts,tsx,js,mjs,cjs}": commands("eslint --fix", "prettier --write"),
    "*.scss": commands("stylelint --fix", "prettier --write"),
    "*.{json,md,yml,yaml}": commands("prettier --write"),
};
