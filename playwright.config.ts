import { defineConfig, devices } from "@playwright/test";

// not 3000: the development servers of this and other projects take it
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_START_TIMEOUT_MS = 240_000;
const NO_JS_SPEC = "nojs.spec.ts";
const SMOKE_SPEC = "smoke.spec.ts";

export default defineConfig({
    testDir: "./e2e",
    tsconfig: "./tsconfig.e2e.json",
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    forbidOnly: !!process.env.CI,
    reporter: [["list"]],
    use: {
        baseURL: BASE_URL,
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
            testIgnore: NO_JS_SPEC,
        },
        {
            name: "nojs",
            use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
            testMatch: NO_JS_SPEC,
        },
        // the other engines get the smoke spec only: the sweeps would multiply the run time
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
            testMatch: SMOKE_SPEC,
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            testMatch: SMOKE_SPEC,
        },
    ],
    // the production build, served exactly as it ships
    webServer: {
        command: "npm run build && npm start",
        url: `${BASE_URL}/health`,
        env: { NEXT_PUBLIC_SITE_URL: BASE_URL, PORT: String(PORT) },
        reuseExistingServer: !process.env.CI,
        timeout: SERVER_START_TIMEOUT_MS,
    },
});
