import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
import path from "node:path";

const rootDir = import.meta.dirname;
const srcDir = path.join(rootDir, "src");

// npm exposes it while it runs a script; package.json stays the single source of the version
const appVersion = process.env.npm_package_version;

if (!appVersion) {
    throw new Error("Run the build through npm so the version is known");
}

// this machine's addresses on its networks: the dev server answers a phone that opens one of them
const networkHosts = Object.values(networkInterfaces())
    .flatMap((addresses) => addresses ?? [])
    .filter(({ family, internal }) => family === "IPv4" && !internal)
    .map(({ address }) => address);

const isDevelopment = process.env.NODE_ENV === "development";

const ONE_YEAR_IN_SECONDS = 31_536_000;

// no nonce: the pages are static (README, Security); the dev server also needs eval and its socket
const CONTENT_SECURITY_POLICY = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${isDevelopment ? " ws:" : ""}`,
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join("; ");

// no HSTS preload: it binds the whole domain to HTTPS for good, beyond what this site can promise
const SECURITY_HEADERS = [
    { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
    {
        key: "Strict-Transport-Security",
        value: `max-age=${ONE_YEAR_IN_SECONDS}; includeSubDomains`,
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
    output: "standalone",
    poweredByHeader: false,
    allowedDevOrigins: networkHosts,
    // the repository documents its own conventions; a generated copy would compete with them
    agentRules: false,
    // without it a lockfile upstream makes Next guess the root and trace the wrong tree
    turbopack: { root: rootDir },
    outputFileTracingRoot: rootDir,
    // an address outside every language gets the site's own 404 page, not the framework's
    experimental: { globalNotFound: true },
    env: { APP_VERSION: appVersion },
    // the root tsconfig.json only lists the projects, so the editor finds the right one for every file
    typescript: { tsconfigPath: "tsconfig.app.json" },
    headers: () =>
        Promise.resolve([{ source: "/:path*", headers: SECURITY_HEADERS }]),
    sassOptions: {
        // lets SCSS modules `@use "styles/..."` the same way TS uses the bare alias
        loadPaths: [srcDir],
    },
};

export default nextConfig;
