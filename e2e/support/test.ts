import type { Page } from "@playwright/test";
import { expect, test as base } from "@playwright/test";

export const NOT_FOUND = 404;

// what Chromium logs for a page that answers 404; on a 404 page that is the point
const NOT_FOUND_LOG = /^Failed to load resource: .* status of 404\b/;

// late work - hydration, fonts, islands - happens after `load`; checks of the final page wait for it
export const settle = async (page: Page): Promise<void> => {
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
        await document.fonts.ready;
    });
};

// a console error or an uncaught exception on the page fails the test that caused it
export const test = base.extend<{ failOnPageErrors: undefined }>({
    failOnPageErrors: [
        async ({ page }, use) => {
            const errors: { text: string; url: string }[] = [];
            const notFoundPages = new Set<string>();

            page.on("response", (response) => {
                if (
                    response.request().isNavigationRequest() &&
                    response.status() === NOT_FOUND
                ) {
                    notFoundPages.add(response.url());
                }
            });
            page.on("console", (message) => {
                if (message.type() === "error") {
                    errors.push({
                        text: message.text(),
                        url: message.location().url,
                    });
                }
            });
            page.on("pageerror", (error) => {
                errors.push({ text: error.message, url: "" });
            });

            await use(undefined);
            await settle(page);

            const isNotFoundLog = ({ text, url }: (typeof errors)[number]) =>
                notFoundPages.has(url) && NOT_FOUND_LOG.test(text);

            expect(
                errors
                    .filter((error) => !isNotFoundLog(error))
                    .map(({ text }) => text),
            ).toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
