import { source } from "content";

import {
    backToTop,
    expectCurrent,
    FIRST_ITEM,
    LAST_ITEM,
    menuButton,
    scrollToSection,
    sheet,
} from "./support/nav";
import { DEFAULT_LOCALE, pathFor, VIEWPORT_HEIGHT } from "./support/site";
import { expect, test } from "./support/test";

const PHONE = { width: 375, height: VIEWPORT_HEIGHT };
// enough presses to walk the whole page down, then back up: going up, elements enter under the bar
const TAB_PRESSES = 80;
const TAB_WALK = [
    ...Array.from({ length: TAB_PRESSES }, () => "Tab"),
    ...Array.from({ length: TAB_PRESSES }, () => "Shift+Tab"),
];

const { ui } = source;

test.describe("on a phone", () => {
    test.use({ viewport: PHONE, isMobile: true, hasTouch: true });

    test("should line the top bar once the page scrolls", async ({ page }) => {
        const root = page.locator("html");

        await page.goto(pathFor(DEFAULT_LOCALE));
        await expect(root).not.toHaveAttribute("data-scrolled");

        await scrollToSection(page, FIRST_ITEM.id);

        await expect(root).toHaveAttribute("data-scrolled");
        await expect
            .poll(
                async () =>
                    (
                        await page
                            .getByRole("banner", {
                                name: ui.topBar[DEFAULT_LOCALE],
                            })
                            .boundingBox()
                    )?.y,
            )
            .toBe(0);
    });

    test("should open the menu and follow a chosen section", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await menuButton(page).click();
        await expect(sheet(page)).toBeVisible();

        await sheet(page).getByRole("link", { name: LAST_ITEM.label }).click();

        await expect(sheet(page)).toBeHidden();
        await expect(page).toHaveURL((url) => url.hash === `#${LAST_ITEM.id}`);
        await expect(page.locator(`#${LAST_ITEM.id}`)).toBeInViewport();
    });

    test("should go on from the chosen section with Tab", async ({ page }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await menuButton(page).focus();
        await page.keyboard.press("Enter");
        await expect(sheet(page)).toBeVisible();
        await sheet(page)
            .getByRole("link", { name: LAST_ITEM.label })
            .press("Enter");
        await expect(sheet(page)).toBeHidden();
        await expect(page.locator(`#${LAST_ITEM.id}`)).toBeFocused();
        await page.keyboard.press("Tab");

        // the next stop is inside the chosen section, not back at the top of the page
        expect(
            await page.evaluate(
                (id) =>
                    document
                        .getElementById(id)
                        ?.contains(document.activeElement),
                LAST_ITEM.id,
            ),
        ).toBe(true);
    });

    test("should mark the current section in the menu", async ({ page }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await scrollToSection(page, FIRST_ITEM.id);
        // a click would first scroll the sticky button to its place in the flow, far above the section
        await menuButton(page).focus();
        await page.keyboard.press("Enter");

        await expect(sheet(page)).toBeVisible();
        await expectCurrent(
            sheet(page).getByRole("link", { name: FIRST_ITEM.label }),
        );
    });

    test("should keep the page in place when a top bar control takes the focus", async ({
        page,
    }) => {
        // an instant scroll, so a jump would already show when the focus has moved
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(pathFor(DEFAULT_LOCALE));
        await scrollToSection(page, LAST_ITEM.id);

        const positions = await page.evaluate(() =>
            [
                ...document.querySelectorAll<HTMLElement>(
                    "header[aria-label] a, header[aria-label] button",
                ),
            ].map((control) => {
                const before = window.scrollY;

                control.focus();

                return window.scrollY - before;
            }),
        );

        expect(positions.length).toBeGreaterThan(0);
        expect(positions.filter((moved) => moved !== 0)).toEqual([]);
    });

    test("should return the focus to the menu button on Escape", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await menuButton(page).click();
        await expect(sheet(page)).toBeVisible();
        await page.keyboard.press("Escape");

        await expect(sheet(page)).toBeHidden();
        await expect(menuButton(page)).toBeFocused();
    });

    test("should show the open menu at once under reduced motion", async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(pathFor(DEFAULT_LOCALE));
        await menuButton(page).click();

        // no waiting: an entry animation would still be at its first frame, below the window
        expect(
            await sheet(page).evaluate(
                (dialog) => getComputedStyle(dialog).transform,
            ),
        ).toBe("none");
        await expect(sheet(page)).toBeInViewport({ ratio: 1 });
    });

    test("should offer a way back to the top after the first screen", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await expect(backToTop(page)).toBeHidden();

        await scrollToSection(page, LAST_ITEM.id);
        await backToTop(page).click();

        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        await expect(backToTop(page)).toBeHidden();
        await expect(page.getByRole("main")).toBeFocused();
    });

    test("should never put a focused element under the top bar", async ({
        page,
    }) => {
        // the property under test is where focus lands, not how the page glides there
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(pathFor(DEFAULT_LOCALE));

        const stops: (string | null)[] = [];

        for (const key of TAB_WALK) {
            await page.keyboard.press(key);

            // the markup of a focused element whose top edge something else covers, null for every other stop
            const covered = await page.evaluate(() => {
                const focused = document.activeElement;

                if (
                    !(focused instanceof HTMLElement) ||
                    focused === document.body
                ) {
                    return null;
                }

                const { left, top, width } = focused.getBoundingClientRect();
                const onTop = document.elementFromPoint(
                    left + width / 2,
                    top + 2,
                );

                return onTop && focused.contains(onTop)
                    ? null
                    : focused.outerHTML.slice(0, 80);
            });

            stops.push(covered);
        }

        expect(stops.filter((stop) => stop !== null)).toEqual([]);
    });
});
