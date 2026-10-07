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
// a common laptop screen less the browser's bars: the height, not the width, limits the image
const SHORT_LAPTOP = { width: 1366, height: 657 };
// up to 639 pixels the dialog leaves this much of the screen free
const PHONE_MARGIN_PX = 24;
const WHEEL_PX = 800;
// a certificate is drawn in the proportions of an A4 sheet; whole pixels round the measured ratio
const CERTIFICATE_RATIO = 1.414;
const RATIO_TOLERANCE = 0.01;

const screenshots = source.projects.items.at(0)?.screenshots ?? [];
const certificate = source.certifications.items.at(0);

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

for (const viewport of [DESKTOP, SHORT_LAPTOP]) {
    test(`should open a certificate in the proportions of a certificate at ${String(viewport.width)}x${String(viewport.height)}`, async ({
        page,
    }) => {
        await page.setViewportSize(viewport);
        await page.goto(pathFor(DEFAULT_LOCALE));
        await page
            .getByRole("button", {
                name: format(source.ui.viewer.openCertificate[DEFAULT_LOCALE], {
                    title: certificate?.title ?? "",
                }),
            })
            .click();

        const dialog = page.getByRole("dialog", { name: certificate?.title });

        await expect(dialog).toBeVisible();

        // the box holding the image or its placeholder is the one with an aspect ratio
        const ratio = await dialog.evaluate((element) => {
            const box = [...element.querySelectorAll("div")].find(
                (div) => getComputedStyle(div).aspectRatio !== "auto",
            );

            return box ? box.offsetWidth / box.offsetHeight : 0;
        });

        expect(Math.abs(ratio - CERTIFICATE_RATIO)).toBeLessThanOrEqual(
            RATIO_TOLERANCE,
        );
    });
}

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
