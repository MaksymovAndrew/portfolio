// Sets the release version: taken from a chore/release-X.Y.Z branch name or passed explicitly.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const VERSION_FILES = ["package.json", "package-lock.json"];
const RELEASE_BRANCH = /^chore\/release-(\d+\.\d+\.\d+)$/;
const VERSION = /^\d+\.\d+\.\d+$/;
const USAGE = "Usage: npm run bump [-- X.Y.Z]";

const fail = (message) => {
    console.error(message);
    process.exit(1);
};

// undefined outside a repository and on every branch that is not a release branch
const readBranchVersion = () => {
    try {
        const branch = execFileSync(
            "git",
            ["rev-parse", "--abbrev-ref", "HEAD"],
            { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
        );

        return RELEASE_BRANCH.exec(branch.trim())?.[1];
    } catch {
        return undefined;
    }
};

// keeps the file's own indent: re-indenting would turn a version bump into a whole-file diff
const readJson = (file) => {
    const text = readFileSync(file, "utf8");
    const indent = /^[ \t]+(?=")/m.exec(text)?.[0] ?? "  ";

    return { json: JSON.parse(text), indent };
};

const isAtVersion = (file, version) => {
    const { json } = readJson(file);
    // the lockfile repeats the version in its entry for the root package
    const rootVersion = json.packages?.[""]?.version ?? version;

    return json.version === version && rootVersion === version;
};

const writeVersion = (file, version) => {
    const { json, indent } = readJson(file);
    const rootPackage = json.packages?.[""];

    json.version = version;

    if (rootPackage) {
        rootPackage.version = version;
    }

    writeFileSync(file, `${JSON.stringify(json, null, indent)}\n`);
};

const outdatedFiles = (version) =>
    VERSION_FILES.filter(
        (file) => existsSync(file) && !isAtVersion(file, version),
    );

const hasUnstagedChanges = (file) =>
    spawnSync("git", ["diff", "--quiet", "--", file]).status === 1;

const bump = (explicitVersion) => {
    const version = explicitVersion ?? readBranchVersion();

    if (!version) {
        fail(
            `Not on a chore/release-X.Y.Z branch, so pass the version. ${USAGE}`,
        );
    }

    if (!VERSION.test(version)) {
        fail(`"${version}" is not an X.Y.Z version. ${USAGE}`);
    }

    const files = outdatedFiles(version);

    files.forEach((file) => writeVersion(file, version));

    console.log(
        files.length > 0
            ? `Set ${version} in: ${files.join(", ")}`
            : `Everything is already at ${version}`,
    );
};

// runs inside a commit: on a release branch the version joins that same commit
const precommit = () => {
    const version = readBranchVersion();

    if (!version) {
        return;
    }

    const files = outdatedFiles(version);

    if (files.length === 0) {
        return;
    }

    // staging the whole file would also commit edits that were left out on purpose
    const unstaged = files.filter(hasUnstagedChanges);

    if (unstaged.length > 0) {
        fail(
            `Unstaged changes in ${unstaged.join(", ")}. Stage or undo them, then commit again.`,
        );
    }

    files.forEach((file) => writeVersion(file, version));
    execFileSync("git", ["add", ...files]);
    console.log(`Release version ${version} set and staged`);
};

const [, , command, versionArgument] = process.argv;

if (command === "bump") {
    bump(versionArgument);
} else if (command === "precommit") {
    precommit();
} else {
    fail(USAGE);
}
