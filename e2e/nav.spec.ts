import { source } from "content";
import { LOCALE_META } from "content/locales";

import {
    backToTop,
    expectCurrent,
    FIRST_ITEM,
    LAST_ITEM,
    menuButton,
    NAV_ITEMS,
    scrollToSection,
    sectionNav,
} from "./support/nav";
import {
    DEFAULT_LOCALE,
    LOCALES,
    pathFor,
    VIEWPORT_HEIGHT,
} from "./support/site";
import { expect, test } from "./support/test";

const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };

const { ui } = source;

// with a single language there is nothing to switch to
const OTHER_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

// runs in the page, so it carries its own numbers: waits for a smooth scroll to stop, then tells whether the page is at its end
const settledAtEnd = () =>
    new Promise<boolean>((resolve) => {
        let last = -1;
        const check = () => {
            if (window.scrollY === last) {
                resolve(
                    window.scrollY + window.innerHeight >=
                        document.documentElement.scrollHeight - 1,
                );

                return;
            }

            last = window.scrollY;
            setTimeout(check, 100);
        };

        check();
    });

test.describe("with the left column", () => {
    test.use({ viewport: DESKTOP });

    test("should mark the section being read", async ({ page }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await scrollToSection(page, FIRST_ITEM.id);

        await expectCurrent(
            sectionNav(page).getByRole("link", { name: FIRST_ITEM.label }),
        );
        await expect(sectionNav(page).locator("[aria-current]")).toHaveCount(1);
    });

    test("should bring every section into view from its link", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));

        for (const item of NAV_ITEMS) {
            await sectionNav(page)
                .getByRole("link", { name: item.label })
                .click();

            await expect(page).toHaveURL((url) => url.hash === `#${item.id}`);
            await expect(page.locator(`#${item.id}`)).toBeInViewport();
            await expectCurrent(
                sectionNav(page).getByRole("link", { name: item.label }),
            );
        }
    });

    test("should keep each chosen section marked once the reader scrolls on", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));

        for (const item of NAV_ITEMS) {
            await sectionNav(page)
                .getByRole("link", { name: item.label })
                .click();
            await expect(page.locator(`#${item.id}`)).toBeInViewport();
            const atEnd = await page.evaluate(settledAtEnd);

            // a nudge of the wheel hands the mark from the link back to what the window shows
            await page.mouse.wheel(0, 1);

            await expectCurrent(
                sectionNav(page).getByRole("link", {
                    name: atEnd ? LAST_ITEM.label : item.label,
                }),
            );
        }
    });

    test("should keep the menu and the back-to-top button away", async ({
        page,
    }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await scrollToSection(page, LAST_ITEM.id);

        await expect(menuButton(page)).toBeHidden();
        await expect(backToTop(page)).toBeHidden();
    });

    for (const locale of OTHER_LOCALES) {
        test(`should keep the section when switching to ${locale}`, async ({
            page,
        }) => {
            await page.goto(pathFor(DEFAULT_LOCALE));
            await scrollToSection(page, FIRST_ITEM.id);
            await expectCurrent(
                sectionNav(page).getByRole("link", { name: FIRST_ITEM.label }),
            );
            await page
                .getByRole("group", { name: ui.languages[DEFAULT_LOCALE] })
                .getByRole("link", { name: LOCALE_META[locale].name })
                .click();

            await expect(page).toHaveURL(
                (url) =>
                    url.pathname === pathFor(locale) &&
                    url.hash === `#${FIRST_ITEM.id}`,
            );
            await expect(page.locator(`#${FIRST_ITEM.id}`)).toBeInViewport();
        });

        test(`should open ${locale} at the top when switching from the first screen`, async ({
            page,
        }) => {
            await page.goto(pathFor(DEFAULT_LOCALE));
            await scrollToSection(page, FIRST_ITEM.id);
            await expectCurrent(
                sectionNav(page).getByRole("link", { name: FIRST_ITEM.label }),
            );
            await page.evaluate(() => {
                window.scrollTo(0, 0);
            });
            await expect(
                sectionNav(page).locator("[aria-current]"),
            ).toHaveCount(0);
            await page
                .getByRole("group", { name: ui.languages[DEFAULT_LOCALE] })
                .getByRole("link", { name: LOCALE_META[locale].name })
                .click();

            await expect(page).toHaveURL(
                (url) => url.pathname === pathFor(locale) && url.hash === "",
            );
        });
    }
});
