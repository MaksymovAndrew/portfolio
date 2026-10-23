import type { Page } from "@playwright/test";

import { source } from "content";

import type { Locale } from "i18n/locales";

import { expectAccessible } from "./support/axe";
import { themeButton, thumbnail } from "./support/controls";
import {
    DEFAULT_LOCALE,
    DESKTOP,
    localePath,
    LOCALES,
    VIEWPORT_HEIGHT,
    WIDTHS,
} from "./support/site";
import { expect, test } from "./support/test";

const MOTION_FLAG = "data-motion";
const CURSOR_FLAG = "data-cursor";
const TRANSITION_SEEN = "data-saw-transition";

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

for (const width of WIDTHS) {
    test(`should pause from the footer at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
        await page.goto(localePath(DEFAULT_LOCALE));
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
            await page.goto(localePath(locale));
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
        await page.goto(localePath(DEFAULT_LOCALE));

        expect(await trackPlayState(page)).toBe("running");

        await pauseButton(page).click();

        await expect.poll(() => trackPlayState(page)).toBe("paused");
        await expect(page.getByText(firstCommand.result)).toBeVisible();
    });

    test("should keep the pause after a reload, from the first frame", async ({
        page,
    }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
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
        await page.goto(localePath(DEFAULT_LOCALE));
        await pauseButton(page).click();
        await thumbnail(page, 0).click();

        // no waiting: an entry animation would still be at its first, transparent frame
        expect(
            await page
                .getByRole("dialog")
                .evaluate((dialog) => getComputedStyle(dialog).opacity),
        ).toBe("1");
    });

    test("should offer no pause under reduced motion", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(localePath(DEFAULT_LOCALE));

        await expect(page.getByRole("contentinfo")).toBeVisible();
        // not only hidden by the stylesheet: not in the page at all
        await expect(
            page.getByRole("contentinfo").locator("button"),
        ).toHaveCount(0);
    });
});

const cursorLayer = (page: Page) => page.locator("[popover]");

// the dot comes first, the ring second
const ringTransform = (page: Page) =>
    cursorLayer(page)
        .locator("> *")
        .nth(1)
        .evaluate((ring) => getComputedStyle(ring).transform);

// the pointer layer arrives with the first move of the mouse once the page has hydrated
const wakePointer = async (page: Page) => {
    await expect(themeButton(page)).toHaveAttribute("data-ready");
    await page.mouse.move(5, 5);
    await expect(cursorLayer(page)).toBeAttached();
};

// whether the page was ever flagged for a theme transition while the test ran
const watchTransitionFlag = (page: Page) =>
    page.evaluate(() => {
        const root = document.documentElement;

        root.dataset.sawTransition = "false";
        new MutationObserver(() => {
            if (root.hasAttribute("data-vt")) {
                root.dataset.sawTransition = "true";
            }
        }).observe(root, { attributeFilter: ["data-vt"] });
    });

test.describe("with a mouse", () => {
    test.use({ viewport: DESKTOP });

    test("should follow the pointer with the custom cursor", async ({
        page,
    }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await wakePointer(page);

        await page.mouse.move(300, 300);
        await expect(page.locator("html")).toHaveAttribute(CURSOR_FLAG, "ring");
        await page.mouse.move(900, 500);

        await expect
            .poll(() => ringTransform(page))
            .toBe("matrix(1, 0, 0, 1, 900, 500)");
    });

    test("should keep the cursor above the open viewer", async ({ page }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await wakePointer(page);
        // counts the layer closing and opening again; one more opening lifts it above a newer modal
        await cursorLayer(page).evaluate((layer) => {
            layer.dataset.toggles = "0";
            layer.addEventListener("beforetoggle", () => {
                layer.dataset.toggles = String(
                    Number(layer.dataset.toggles) + 1,
                );
            });
        });

        await thumbnail(page, 0).click();

        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(cursorLayer(page)).toHaveAttribute("data-toggles", "2");
        expect(
            await cursorLayer(page).evaluate((layer) =>
                layer.matches(":popover-open"),
            ),
        ).toBe(true);
    });

    test("should pull a main button towards a pointer close to it", async ({
        page,
    }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await wakePointer(page);
        const button = page.locator("[data-magnetic]").first();
        const box = await button.boundingBox();

        expect(box).not.toBeNull();
        await page.mouse.move(
            (box?.x ?? 0) + (box?.width ?? 0) + 10,
            (box?.y ?? 0) + (box?.height ?? 0) / 2,
        );

        await expect(button).toHaveCSS(
            "transform",
            /^matrix\(1, 0, 0, 1, [1-9]/,
        );
    });

    test("should tilt the project card under the pointer", async ({ page }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await wakePointer(page);
        const card = page.locator("[data-tilt]").first();

        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();

        expect(box).not.toBeNull();
        await page.mouse.move(
            (box?.x ?? 0) + (box?.width ?? 0) * 0.8,
            (box?.y ?? 0) + (box?.height ?? 0) * 0.2,
        );

        await expect(card).toHaveAttribute("data-tilting", "");
        await expect(card).toHaveCSS("transform", /^matrix3d\(/);
    });

    test("should raise a block below the fold once it scrolls into view", async ({
        page,
    }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        const block = page.locator("#contact > *").last();

        await expect(block).toHaveAttribute("data-reveal", "");

        await block.scrollIntoViewIfNeeded();

        await expect
            .poll(() =>
                block.evaluate((node) => getComputedStyle(node).opacity),
            )
            .toBe("1");
    });

    test("should grow the new theme in a circle", async ({ page }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await watchTransitionFlag(page);

        await themeButton(page).click();

        await expect(page.locator("html")).toHaveAttribute(
            TRANSITION_SEEN,
            "true",
        );
        await expect(page.locator("html")).not.toHaveAttribute("data-vt");
    });
});

test.describe("on a touch screen", () => {
    test.use({
        viewport: { width: 375, height: VIEWPORT_HEIGHT },
        hasTouch: true,
        isMobile: true,
    });

    test("should load no pointer layer", async ({ page }) => {
        await page.goto(localePath(DEFAULT_LOCALE));
        await expect(page.getByRole("contentinfo")).toBeAttached();

        await expect(cursorLayer(page)).toHaveCount(0);
        await expect(page.locator("html")).not.toHaveAttribute(CURSOR_FLAG);
    });
});

test.describe("under reduced motion", () => {
    test.use({ viewport: DESKTOP });

    test("should hide no block and switch the theme at once", async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(localePath(DEFAULT_LOCALE));
        await watchTransitionFlag(page);

        await themeButton(page).click();

        await expect(page.locator("html")).toHaveAttribute(
            TRANSITION_SEEN,
            "false",
        );
        await expect(page.locator("[data-reveal]")).toHaveCount(0);
        await expect(cursorLayer(page)).toHaveCount(0);
    });
});
