// Lighthouse (mobile) on every language of the production build, held to lighthouse.config.mjs.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

import { DEFAULT_LOCALE, LOCALES } from "../content/locales.ts";
import config from "../lighthouse.config.mjs";
import { startServer } from "./serve.mjs";

const rootDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const reportDir = path.join(rootDir, "lighthouse-report");

// not 3000: the development servers take it; not 3100: the browser tests do
const PORT = 3101;
const BASE_URL = `http://localhost:${PORT}`;
const SERVER_START_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 250;
const BYTES_PER_KB = 1024;
const DECIMALS = 1000;

// the Lighthouse request type each budget counts; null counts every request
const RESOURCE_TYPES = { script: "Script", font: "Font", total: null };

// performance always runs: it holds the layout-shift and network audits the checks read
const CATEGORIES = [...new Set(["performance", ...Object.keys(config.scores)])];

// the rule of e2e/support/site.ts, which this script cannot import
const pathFor = (locale) => (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);

const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const transferKb = (lhr, budget) => {
    const resourceType = RESOURCE_TYPES[budget];
    const bytes = lhr.audits["network-requests"].details.items
        .filter(
            (item) =>
                resourceType === null || item.resourceType === resourceType,
        )
        .reduce((sum, item) => sum + item.transferSize, 0);

    return bytes / BYTES_PER_KB;
};

// a budget is one number for every page, or one per page with `other` for the rest
const limitKb = (maxKb, page) =>
    typeof maxKb === "number" ? maxKb : (maxKb[page] ?? maxKb.other);

const CHECKS = [
    ...Object.entries(config.scores).map(([id, { min, level }]) => ({
        name: `${id} score`,
        read: (lhr) => lhr.categories[id].score,
        passes: (value) => value >= min,
        limit: () => `>= ${min}`,
        level,
    })),
    ...Object.entries(config.metrics).map(([id, { max, level }]) => ({
        name: id,
        read: (lhr) => lhr.audits[id].numericValue,
        passes: (value) => value <= max,
        limit: () => `<= ${max}`,
        level,
    })),
    ...Object.entries(config.budgets).map(([budget, { maxKb, level }]) => ({
        name: `${budget} transfer, KB`,
        read: (lhr) => transferKb(lhr, budget),
        passes: (value, page) => value <= limitKb(maxKb, page),
        limit: (page) => `<= ${limitKb(maxKb, page)}`,
        level,
    })),
];

const answers = (url) =>
    fetch(url).then(
        () => true,
        () => false,
    );

const isUp = (url) =>
    fetch(url).then(
        (response) => response.ok,
        () => false,
    );

const checkSetup = async () => {
    const unknownBudgets = Object.keys(config.budgets).filter(
        (budget) => !Object.hasOwn(RESOURCE_TYPES, budget),
    );

    if (unknownBudgets.length > 0) {
        throw new Error(
            `Unknown budget in lighthouse.config.mjs: ${unknownBudgets.join(", ")}. Known: ${Object.keys(RESOURCE_TYPES).join(", ")}.`,
        );
    }

    const unlimited = Object.entries(config.budgets).filter(
        ([, { maxKb }]) =>
            typeof maxKb !== "number" && !Object.hasOwn(maxKb, "other"),
    );

    if (unlimited.length > 0) {
        throw new Error(
            `A per-page budget in lighthouse.config.mjs needs "other" for the remaining pages: ${unlimited.map(([budget]) => budget).join(", ")}.`,
        );
    }

    // another server there would answer instead of this build
    if (await answers(BASE_URL)) {
        throw new Error(
            `Port ${PORT} is taken: stop the server running there.`,
        );
    }
};

const waitForServer = async () => {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;

    while (!(await isUp(`${BASE_URL}/health`))) {
        if (Date.now() > deadline) {
            throw new Error(`The server did not answer on ${BASE_URL}.`);
        }

        await delay(POLL_INTERVAL_MS);
    }
};

const runLighthouse = async (url, port) => {
    const runs = [];

    for (let run = 0; run < config.runs; run += 1) {
        const { lhr, report } = await lighthouse(url, {
            port,
            output: "html",
            logLevel: "error",
            onlyCategories: CATEGORIES,
        });

        if (lhr.runtimeError) {
            throw new Error(`${url}: ${lhr.runtimeError.message}`);
        }

        runs.push({ lhr, report });
    }

    return runs;
};

const auditLocale = async (locale, port) => {
    const runs = await runLighthouse(`${BASE_URL}${pathFor(locale)}`, port);
    const byPerformance = runs.toSorted(
        (a, b) =>
            a.lhr.categories.performance.score -
            b.lhr.categories.performance.score,
    );

    writeFileSync(
        path.join(reportDir, `${locale}.html`),
        byPerformance[Math.floor(runs.length / 2)].report,
    );

    const page = pathFor(locale);

    return CHECKS.map((check) => {
        const value = median(runs.map(({ lhr }) => check.read(lhr)));
        const passed = check.passes(value, page);

        return {
            page,
            check: check.name,
            value: Math.round(value * DECIMALS) / DECIMALS,
            limit: check.limit(page),
            result: passed ? "pass" : check.level,
        };
    });
};

const auditAll = async () => {
    // Playwright starts its Chromium without the sandbox too: Ubuntu runners refuse it
    const chrome = await launch({
        chromePath: chromium.executablePath(),
        chromeFlags: ["--headless", "--no-sandbox"],
    });

    try {
        const rows = [];

        for (const locale of LOCALES) {
            rows.push(...(await auditLocale(locale, chrome.port)));
        }

        return rows;
    } finally {
        chrome.kill();
    }
};

// on GitHub a failed check also shows on the run summary, so a "warn" does not hide in the log
const annotate = (rows) => {
    for (const row of rows.filter(({ result }) => result !== "pass")) {
        const command = row.result === "error" ? "error" : "warning";

        console.log(
            `::${command} title=Lighthouse::${row.page} ${row.check} ${row.value}, limit ${row.limit}`,
        );
    }
};

const main = async () => {
    await checkSetup();

    const server = startServer({ port: PORT });

    try {
        await waitForServer();
        mkdirSync(reportDir, { recursive: true });

        const rows = await auditAll();

        console.table(rows);
        console.log(`Reports: ${path.relative(rootDir, reportDir)}`);

        if (process.env.GITHUB_ACTIONS) {
            annotate(rows);
        }

        return rows.some(({ result }) => result === "error") ? 1 : 0;
    } finally {
        server.kill();
    }
};

try {
    process.exitCode = await main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
}
