import type { Page } from "@playwright/test";

import {
    DEFAULT_LOCALE,
    pathFor,
    VIEWPORT_HEIGHT,
    WIDTHS,
} from "./support/site";
import { expect, settle, test } from "./support/test";

const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
const PHONE = { width: 375, height: VIEWPORT_HEIGHT };
// a point inside the first row of the skills band: past its top padding, inside the first token's height
const FIRST_ROW = { x: 120, y: 30 };

const skills = (page: Page) => page.locator("#skills");

// where every block on screen that rises in came to rest, found by its animation's name
const risenBlocks = (page: Page) =>
    page.evaluate(() =>
        [...document.querySelectorAll("body *")]
            .filter(
                (element) =>
                    element.getClientRects().length > 0 &&
                    getComputedStyle(element).animationName.includes("rise"),
            )
            .map((element) => {
                const { opacity, transform } = getComputedStyle(element);

                return { opacity, transform };
            }),
    );

for (const viewport of [PHONE, DESKTOP]) {
    test(`should end the entry with every block in place at ${viewport.width}px`, async ({
        page,
    }) => {
        await page.setViewportSize(viewport);
        await page.goto(pathFor(DEFAULT_LOCALE));
        await settle(page);

        const blocks = await risenBlocks(page);

        expect(blocks.length).toBeGreaterThan(0);
        expect(
            blocks.filter(
                ({ opacity, transform }) =>
                    opacity !== "1" || transform !== "none",
            ),
        ).toEqual([]);
    });
}

test("should pause a row of skills under the pointer", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));

    const track = skills(page).getByRole("list").first();
    const playState = () =>
        track.evaluate((list) => getComputedStyle(list).animationPlayState);

    expect(await playState()).toBe("running");

    // the tracks never stand still, so the pointer goes to the band itself, over the first row
    await skills(page).hover({ position: FIRST_ROW });

    await expect.poll(playState).toBe("paused");
});

for (const width of WIDTHS) {
    test(`should show every skill once and still at ${width}px under reduced motion`, async ({
        page,
    }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
        await page.goto(pathFor(DEFAULT_LOCALE));

        const outside = await skills(page)
            .getByRole("listitem")
            .evaluateAll((tokens) =>
                tokens
                    .filter((token) => {
                        const box = token.getBoundingClientRect();

                        return box.left < 0 || box.right > window.innerWidth;
                    })
                    .map((token) => token.textContent),
            );
        const shownCopies = await skills(page)
            .locator('[aria-hidden="true"]')
            .evaluateAll(
                (copies) =>
                    copies.filter(
                        (copy) => getComputedStyle(copy).display !== "none",
                    ).length,
            );

        expect(outside).toEqual([]);
        expect(shownCopies).toBe(0);
        expect(await page.evaluate(() => document.getAnimations().length)).toBe(
            0,
        );
    });
}
