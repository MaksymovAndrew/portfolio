import type { Page } from "@playwright/test";

import { source } from "content";

import type { Locale } from "i18n/locales";

import { format } from "utils/inline";

import { expectAccessible } from "./support/axe";
import {
    DEFAULT_LOCALE,
    LOCALES,
    pathFor,
    VIEWPORT_HEIGHT,
    WIDTHS,
} from "./support/site";
import { expect, test } from "./support/test";

const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
const MOTION_FLAG = "data-motion";

const { motion } = source.ui;
const [firstCommand] = source.terminal.commands;

const pauseButton = (page: Page, locale: Locale = DEFAULT_LOCALE) =>
    page.getByRole("button", { name: motion.pause[locale] });

const resumeButton = (page: Page, locale: Locale = DEFAULT_LOCALE) =>
    page.getByRole("button", { name: motion.resume[locale] });

const trackPlayState = (page: Page) =>
    page
        .locator("#skills")
        .getByRole("list")
        .first()
        .evaluate((list) => getComputedStyle(list).animationPlayState);

const thumbnail = (page: Page) =>
    page.getByRole("button", {
        name: format(source.ui.viewer.openScreenshot[DEFAULT_LOCALE], {
            index: "1",
        }),
    });

for (const width of WIDTHS) {
    test(`should pause from the footer at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
        await page.goto(pathFor(DEFAULT_LOCALE));
        await pauseButton(page).click();

        await expect(resumeButton(page)).toBeInViewport();
        await expectAccessible(page);
    });
}

test.describe("on a desktop", () => {
    test.use({ viewport: DESKTOP });

    for (const locale of LOCALES) {
        test(`should pause and resume the animations in ${locale}`, async ({
            page,
        }) => {
            await page.goto(pathFor(locale));
            await pauseButton(page, locale).click();

            await expect(page.locator("html")).toHaveAttribute(
                MOTION_FLAG,
                "off",
            );
            await expect(resumeButton(page, locale)).toBeVisible();

            await resumeButton(page, locale).click();

            await expect(page.locator("html")).not.toHaveAttribute(MOTION_FLAG);
            await expect(pauseButton(page, locale)).toBeVisible();
        });
    }

    test("should stop the skills and show the first command while paused", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));

        expect(await trackPlayState(page)).toBe("running");

        await pauseButton(page).click();

        await expect.poll(() => trackPlayState(page)).toBe("paused");
        await expect(page.getByText(firstCommand.result)).toBeVisible();
    });

    test("should keep the pause after a reload, from the first frame", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await pauseButton(page).click();
        await expect(page.locator("html")).toHaveAttribute(MOTION_FLAG, "off");

        // before hydration the pre-paint script has already applied the stored choice
        await page.reload({ waitUntil: "commit" });
        await expect(page.locator("html")).toHaveAttribute(MOTION_FLAG, "off");

        await expect.poll(() => trackPlayState(page)).toBe("paused");
        await expect(resumeButton(page)).toBeVisible();
    });

    test("should open the viewer fully visible while paused", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await pauseButton(page).click();
        await thumbnail(page).click();

        // no waiting: an entry animation would still be at its first, transparent frame
        expect(
            await page
                .getByRole("dialog")
                .evaluate((dialog) => getComputedStyle(dialog).opacity),
        ).toBe("1");
    });

    test("should offer no pause under reduced motion", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(pathFor(DEFAULT_LOCALE));

        await expect(page.getByRole("contentinfo")).toBeVisible();
        // not only hidden by the stylesheet: not in the page at all
        await expect(
            page.getByRole("contentinfo").locator("button"),
        ).toHaveCount(0);
    });
});
