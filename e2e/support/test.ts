import type { Page } from "@playwright/test";
import { expect, test as base } from "@playwright/test";

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
            const errors: string[] = [];

            page.on("console", (message) => {
                if (message.type() === "error") {
                    errors.push(message.text());
                }
            });
            page.on("pageerror", (error) => {
                errors.push(error.message);
            });

            await use(undefined);
            await settle(page);

            expect(errors).toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
