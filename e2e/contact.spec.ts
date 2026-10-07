import type { Page } from "@playwright/test";

import { source } from "content";

import type { Locale } from "i18n/locales";

import {
    DEFAULT_LOCALE,
    LOCALES,
    pathFor,
    VIEWPORT_HEIGHT,
} from "./support/site";
import { expect, test } from "./support/test";

const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
// the narrow phones, where the address shrinks and may break before its "@"
const NARROW_WIDTHS = [320, 360, 375] as const;

const { email } = source.profile;

// named by its text: a browser does not put a space at the <wbr> before the "@"
const address = (page: Page) =>
    page.locator("#contact").getByRole("link", { name: email, exact: true });

const copyButton = (page: Page, locale: Locale) =>
    page.getByRole("button", { name: source.ui.copy.label[locale] });

test.describe("on a phone", () => {
    // a phone's scrollbar overlays the page; a desktop one would take its gutter from the row
    test.use({ isMobile: true, hasTouch: true });

    for (const width of NARROW_WIDTHS) {
        for (const locale of LOCALES) {
            test(`should keep the copy button on the address line at ${String(width)}px in ${locale}`, async ({
                page,
            }) => {
                await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
                await page.goto(pathFor(locale));
                await expect(address(page)).toBeVisible();
                await expect(copyButton(page, locale)).toBeVisible();

                const line = await address(page).boundingBox();
                const button = await copyButton(page, locale).boundingBox();
                const centre = (button?.y ?? 0) + (button?.height ?? 0) / 2;

                expect(centre).toBeGreaterThanOrEqual(line?.y ?? 0);
                expect(centre).toBeLessThanOrEqual(
                    (line?.y ?? 0) + (line?.height ?? 0),
                );
                expect(
                    (button?.x ?? 0) + (button?.width ?? 0),
                ).toBeLessThanOrEqual(width);
            });

            test(`should keep the part before "@" on one line after a copy at ${String(width)}px in ${locale}`, async ({
                page,
                context,
            }) => {
                await context.grantPermissions([
                    "clipboard-read",
                    "clipboard-write",
                ]);
                await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
                await page.goto(pathFor(locale));
                await copyButton(page, locale).click();
                await expect(
                    page.locator("#contact").getByRole("status"),
                ).toHaveText(source.ui.copy.status[locale]);

                // the lines the text before the <wbr> takes
                const lines = await address(page).evaluate((link) => {
                    const range = document.createRange();

                    range.selectNodeContents(link.firstChild ?? link);

                    return range.getClientRects().length;
                });

                expect(lines).toBe(1);
            });
        }
    }
});

test("should copy the address and say so", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    await copyButton(page, DEFAULT_LOCALE).click();

    await expect(page.locator("#contact").getByRole("status")).toHaveText(
        source.ui.copy.status[DEFAULT_LOCALE],
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        email,
    );
});

for (const action of source.hero.actions) {
    test(`should scroll to ${action.target} from the first screen`, async ({
        page,
    }) => {
        await page.setViewportSize(DESKTOP);
        await page.goto(pathFor(DEFAULT_LOCALE));
        await page
            .getByRole("link", { name: action.label[DEFAULT_LOCALE] })
            .click();

        await expect(page).toHaveURL((url) => url.hash === `#${action.target}`);
        await expect(page.locator(`#${action.target}`)).toBeInViewport();
    });
}
