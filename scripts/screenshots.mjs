// Draws the README screenshots: the first screen of the default language in both themes, from the last production build.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

import { STORAGE_KEYS } from "../src/constants/storage.ts";
import { startServer } from "./serve.mjs";

const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const outDir = path.join(rootDir, "docs", "screenshots");

// not 3000, 3100 or 3101: the development servers, the browser tests and Lighthouse take them
const PORT = 3102;
const BASE_URL = `http://localhost:${PORT}`;
const SERVER_START_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 250;
const VIEWPORT = { width: 1440, height: 900 };
// the first screen down to the skills, before the first section begins
const FRAME = { x: 0, y: 0, width: VIEWPORT.width, height: 515 };
const THEMES = ["dark", "light"];

const isUp = (url) =>
    fetch(url).then(
        (response) => response.ok,
        () => false,
    );

const waitForServer = async () => {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;

    while (!(await isUp(`${BASE_URL}/health`))) {
        if (Date.now() > deadline) {
            throw new Error(`The server did not answer on ${BASE_URL}.`);
        }

        await delay(POLL_INTERVAL_MS);
    }
};

// the stored choices the pre-paint script applies: the theme, and paused motion so drifting parts hold still
const storeChoices = ([themeKey, theme, motionKey]) => {
    localStorage.setItem(themeKey, theme);
    localStorage.setItem(motionKey, "off");
};

const shoot = async (browser, theme) => {
    const context = await browser.newContext({ viewport: VIEWPORT });

    try {
        await context.addInitScript(storeChoices, [
            STORAGE_KEYS.theme,
            theme,
            STORAGE_KEYS.motion,
        ]);

        const page = await context.newPage();

        await page.goto(BASE_URL);
        await page.waitForLoadState("networkidle");
        // runs in the page, where the document is the window's
        await page.evaluate(async () => {
            const { document } = globalThis;

            await document.fonts.ready;
            // the first screen rises in; a cancelled animation counts as done
            await Promise.allSettled(
                document
                    .getAnimations()
                    .filter(
                        (animation) =>
                            animation.effect?.getComputedTiming().iterations !==
                            Infinity,
                    )
                    .map((animation) => animation.finished),
            );
        });
        await page.screenshot({
            path: path.join(outDir, `${theme}.png`),
            clip: FRAME,
        });
    } finally {
        await context.close();
    }
};

const main = async () => {
    if (await isUp(`${BASE_URL}/health`)) {
        throw new Error(
            `Port ${PORT} is taken: stop the server running there.`,
        );
    }

    const server = startServer({ port: PORT });

    try {
        await waitForServer();
        mkdirSync(outDir, { recursive: true });

        const browser = await chromium.launch();

        try {
            for (const theme of THEMES) {
                await shoot(browser, theme);
            }
        } finally {
            await browser.close();
        }

        console.log(`Screenshots: ${path.relative(rootDir, outDir)}`);
    } finally {
        server.kill();
    }
};

try {
    await main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
}
