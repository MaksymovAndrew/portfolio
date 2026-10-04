import type { NextConfig } from "next";
import path from "node:path";

const rootDir = import.meta.dirname;
const srcDir = path.join(rootDir, "src");

// npm exposes both while it runs a script; package.json stays the single source of the name and version
const appName = process.env.npm_package_name;
const appVersion = process.env.npm_package_version;

if (!appName || !appVersion) {
    throw new Error(
        "Run the build through npm so the package name and version are known",
    );
}

const nextConfig: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    // the repository documents its own conventions; a generated copy would compete with them
    agentRules: false,
    // without it a lockfile upstream makes Next guess the root and trace the wrong tree
    turbopack: { root: rootDir },
    outputFileTracingRoot: rootDir,
    env: {
        APP_NAME: appName,
        APP_VERSION: appVersion,
    },
    sassOptions: {
        // lets SCSS modules `@use "styles/..."` the same way TS uses the bare alias
        loadPaths: [srcDir],
    },
};

export default nextConfig;
