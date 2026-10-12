// Serves the production build with the standalone server, exactly what ships in the container.
import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptFile), "..");
const buildDir = path.join(rootDir, ".next");
const standaloneDir = path.join(buildDir, "standalone");
const publicDir = path.join(rootDir, "public");

const SERVER_FILE = "server.js";
const DEFAULT_PORT = 3000;
// every interface: localhost and the other devices of the same network. Not 127.0.0.1: Next calls a loopback address localhost inside the proxy, and its rewrites would leave the server
const DEFAULT_HOST = "0.0.0.0";

// the standalone output leaves both folders out: a CDN usually serves them
const copyStaticFiles = () => {
    cpSync(
        path.join(buildDir, "static"),
        path.join(standaloneDir, ".next", "static"),
        { recursive: true },
    );

    if (existsSync(publicDir)) {
        cpSync(publicDir, path.join(standaloneDir, "public"), {
            recursive: true,
        });
    }
};

export const startServer = ({
    port = DEFAULT_PORT,
    host = DEFAULT_HOST,
    stdio = "inherit",
} = {}) => {
    if (!existsSync(path.join(standaloneDir, SERVER_FILE))) {
        throw new Error(
            'No production build found. Run "npm run build" first.',
        );
    }

    copyStaticFiles();

    // HOSTNAME is set explicitly: some shells export the machine name and the server would bind to it
    return spawn(process.execPath, [SERVER_FILE], {
        cwd: standaloneDir,
        stdio,
        env: { ...process.env, PORT: String(port), HOSTNAME: host },
    });
};

// home and office networks; a VPN adapter's public-looking address is left out
const PRIVATE_RANGE = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

// the addresses a phone on the same network opens
const lanUrls = (port) =>
    Object.values(networkInterfaces())
        .flat()
        .filter(
            (address) =>
                address?.family === "IPv4" &&
                PRIVATE_RANGE.test(address.address),
        )
        .map((address) => `http://${address.address}:${port}`);

if (process.argv[1] === scriptFile) {
    try {
        const port = process.env.PORT ?? DEFAULT_PORT;
        const host = process.env.SERVE_HOST ?? DEFAULT_HOST;
        const urls = host === DEFAULT_HOST ? lanUrls(port) : [];
        const server = startServer({
            port,
            host,
            stdio: ["inherit", "pipe", "inherit"],
        });

        // Next prints the bind address 0.0.0.0, which no phone can open; the real addresses go in its place
        server.stdout.on("data", (chunk) => {
            process.stdout.write(
                String(chunk).replace(
                    /^(- Network:\s+)http:\/\/0\.0\.0\.0:\d+$/m,
                    (_, label) =>
                        urls.length > 0 ? `${label}${urls.join(", ")}` : "",
                ),
            );
        });

        server.on("exit", (code) => {
            process.exit(code ?? 1);
        });
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
