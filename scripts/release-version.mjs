// Sets the release version: taken from a chore/release-X.Y.Z branch name or passed explicitly.
import { execFileSync } from "node:child_process";
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

const writeVersion = (file, version) => {
    const { json, indent } = readJson(file);
    // the lockfile repeats the version in its entry for the root package
    const rootPackage = json.packages?.[""];
    const versions = [json.version, rootPackage?.version ?? version];

    if (versions.every((current) => current === version)) {
        return false;
    }

    json.version = version;

    if (rootPackage) {
        rootPackage.version = version;
    }

    writeFileSync(file, `${JSON.stringify(json, null, indent)}\n`);

    return true;
};

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

    const written = VERSION_FILES.filter(
        (file) => existsSync(file) && writeVersion(file, version),
    );

    console.log(
        written.length > 0
            ? `Set ${version} in: ${written.join(", ")}`
            : `Everything is already at ${version}`,
    );
};

const [, , command, versionArgument] = process.argv;

if (command === "bump") {
    bump(versionArgument);
} else {
    fail(USAGE);
}
