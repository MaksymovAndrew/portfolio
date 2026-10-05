// Serves the production build with the standalone server, exactly what ships in the container.
import { spawn } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(scriptFile), "..");
const buildDir = path.join(rootDir, ".next");
const standaloneDir = path.join(buildDir, "standalone");
const publicDir = path.join(rootDir, "public");

const SERVER_FILE = "server.js";
const DEFAULT_PORT = 3000;
// not 127.0.0.1: Next calls a loopback address localhost inside the proxy, and its rewrites would leave the server
const DEFAULT_HOST = "localhost";

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
        stdio: "inherit",
        env: { ...process.env, PORT: String(port), HOSTNAME: host },
    });
};

if (process.argv[1] === scriptFile) {
    try {
        const server = startServer({
            port: process.env.PORT,
            host: process.env.SERVE_HOST,
        });

        server.on("exit", (code) => {
            process.exit(code ?? 1);
        });
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
