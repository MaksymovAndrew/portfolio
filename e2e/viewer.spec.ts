import type { Page } from "@playwright/test";

import { GLYPHS } from "constants/glyphs";

import { source } from "content";

import type { Locale } from "i18n/locales";

import { format } from "utils/inline";

import { expectAccessible } from "./support/axe";
import {
    DEFAULT_LOCALE,
    LOCALES,
    pathFor,
    THEMES,
    VIEWPORT_HEIGHT,
} from "./support/site";
import { expect, storeTheme, test } from "./support/test";

const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
const PHONE = { width: 375, height: VIEWPORT_HEIGHT };
// up to 639 pixels the dialog leaves this much of the screen free
const PHONE_MARGIN_PX = 24;
const WHEEL_PX = 800;

const screenshots = source.projects.items.at(0)?.screenshots ?? [];

const thumbnail = (
    page: Page,
    index: number,
    locale: Locale = DEFAULT_LOCALE,
) =>
    page.getByRole("button", {
        name: format(source.ui.viewer.openScreenshot[locale], {
            index: String(index + 1),
        }),
    });

// the dialog is named by the caption of the screenshot it shows
const viewer = (page: Page, index: number, locale: Locale = DEFAULT_LOCALE) =>
    page.getByRole("dialog", { name: screenshots[index]?.caption[locale] });

const counter = (index: number) =>
    `${String(index + 1)} ${GLYPHS.counter} ${String(screenshots.length)}`;

// two frames: time enough for a wheel to move the page if it could
const nextFrames = (page: Page) =>
    page.evaluate(
        () =>
            new Promise((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(resolve));
            }),
    );

test("should open a screenshot from its thumbnail and step with the arrow keys", async ({
    page,
}) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    await thumbnail(page, 0).click();

    await expect(viewer(page, 0)).toBeVisible();
    await expect(viewer(page, 0)).toContainText(counter(0));

    await page.keyboard.press("ArrowRight");

    await expect(viewer(page, 1)).toContainText(counter(1));

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(thumbnail(page, 0)).toBeFocused();
});

test("should keep the page still under the open viewer", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    await thumbnail(page, 0).click();
    await expect(viewer(page, 0)).toBeVisible();

    const box = await viewer(page, 0).boundingBox();
    const scrollY = () => page.evaluate(() => window.scrollY);
    const before = await scrollY();

    await page.mouse.move(
        (box?.x ?? 0) + (box?.width ?? 0) / 2,
        (box?.y ?? 0) + (box?.height ?? 0) / 2,
    );
    await page.mouse.wheel(0, WHEEL_PX);
    await nextFrames(page);

    expect(await scrollY()).toBe(before);
    expect(
        await page.evaluate(
            () => getComputedStyle(document.documentElement).overflow,
        ),
    ).toBe("hidden");

    // the same wheel moves the page once the viewer is closed
    await page.keyboard.press("Escape");
    await page.mouse.wheel(0, WHEEL_PX);

    await expect.poll(scrollY).toBeGreaterThan(before);
});

test.describe("on a phone", () => {
    // a phone's scrollbar overlays the page; a desktop one would take its reserved gutter from the dialog's width
    test.use({ viewport: PHONE, isMobile: true, hasTouch: true });

    test("should leave a narrow margin around the viewer", async ({ page }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await thumbnail(page, 0).click();
        await expect(viewer(page, 0)).toBeVisible();

        // the layout width, untouched by the scale of the entry animation
        const width = await viewer(page, 0).evaluate(
            (dialog: HTMLElement) => dialog.offsetWidth,
        );

        expect(width).toBeGreaterThanOrEqual(PHONE.width - PHONE_MARGIN_PX);
    });
});

test("should show the open viewer at once under reduced motion", async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    await thumbnail(page, 0).click();

    // no waiting: an entry animation would still be at its first, transparent frame
    expect(
        await viewer(page, 0).evaluate(
            (dialog) => getComputedStyle(dialog).opacity,
        ),
    ).toBe("1");
});

for (const viewport of [PHONE, DESKTOP]) {
    for (const mode of THEMES) {
        for (const locale of LOCALES) {
            test(`should pass the accessibility rules with the viewer open at ${String(viewport.width)}px in ${locale}, ${mode}`, async ({
                page,
            }) => {
                await storeTheme(page, mode);
                await page.setViewportSize(viewport);
                await page.goto(pathFor(locale));
                await thumbnail(page, 0, locale).click();
                await expect(viewer(page, 0, locale)).toBeVisible();

                await expectAccessible(page);
            });
        }
    }
}
