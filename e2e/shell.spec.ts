import type { Page } from "@playwright/test";

import { source } from "content";
import { LOCALE_META } from "content/locales";
import { theme } from "theme/theme";

import {
    DEFAULT_LOCALE,
    LOCALES,
    pathFor,
    THEMES,
    VIEWPORT_HEIGHT,
    WIDTHS,
} from "./support/site";
import { expect, test } from "./support/test";

// from this width the left column replaces the top bar
const TWO_COLUMNS = 1024;
const DESKTOP = { width: 1440, height: VIEWPORT_HEIGHT };
const PHONE = { width: 375, height: VIEWPORT_HEIGHT };
const LOW_WINDOW = { width: 1280, height: 700 };
const LONG_PAGE_PX = 3000;
// WCAG 2.2 target size
const MIN_TARGET_PX = 24;

// with a single language there are no language links to follow
const OTHER_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

const { ui } = source;
const topBarName = ui.topBar[DEFAULT_LOCALE];
const themeName = ui.theme[DEFAULT_LOCALE];

const OTHER_MODE =
    THEMES.find((mode) => mode !== theme.defaultMode) ?? theme.defaultMode;

// the switch shows the icon of the theme a click leads to: the sun first, the moon second
const ICON_INDEX = { light: 0, dark: 1 } as const;

const iconOf = (page: Page, mode: (typeof THEMES)[number]) =>
    page
        .getByRole("banner", { name: topBarName })
        .getByRole("button", { name: themeName })
        .locator("svg")
        .nth(ICON_INDEX[mode]);

for (const width of WIDTHS.filter((each) => each < TWO_COLUMNS)) {
    test(`should show the top bar and the name in the content at ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
        await page.goto(pathFor(DEFAULT_LOCALE));

        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(
            page.getByRole("banner", { name: topBarName }),
        ).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(
            page.getByRole("main").getByRole("heading", { level: 1 }),
        ).toBeVisible();
    });
}

for (const width of WIDTHS.filter((each) => each >= TWO_COLUMNS)) {
    test(`should show the left column with the name at ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
        await page.goto(pathFor(DEFAULT_LOCALE));

        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(
            page.getByRole("banner", { name: topBarName }),
        ).toBeHidden();
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(
            page.getByRole("banner").getByRole("heading", { level: 1 }),
        ).toBeVisible();
    });
}

test("should keep the left column in view while the page scrolls", async ({
    page,
}) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    // a page longer than any window, whatever the content holds
    await page.getByRole("main").evaluate((main, height) => {
        const filler = document.createElement("div");

        filler.style.height = `${height}px`;
        main.append(filler);
    }, LONG_PAGE_PX);
    await page.evaluate(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "instant",
        });
    });

    await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(LONG_PAGE_PX / 2);
    await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
});

for (const locale of LOCALES) {
    test(`should fit the left column into a low window in ${locale}`, async ({
        page,
    }) => {
        await page.setViewportSize(LOW_WINDOW);
        await page.goto(pathFor(locale));

        const overflow = await page
            .getByRole("banner")
            .evaluate((sidebar) => sidebar.scrollHeight - sidebar.clientHeight);

        expect(overflow).toBeLessThanOrEqual(0);
    });
}

test("should move focus to the content from the skip link", async ({
    page,
}) => {
    await page.goto(pathFor(DEFAULT_LOCALE));
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", {
        name: ui.skipToContent[DEFAULT_LOCALE],
    });

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
    // hidden, it is a 1px box; focused, it is a button-sized target
    expect(
        await skipLink.evaluate((link) => link.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(MIN_TARGET_PX);

    await page.keyboard.press("Enter");

    await expect(page.getByRole("main")).toBeFocused();
});

test("should show a theme change made in the left column in the top bar", async ({
    page,
}) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(pathFor(DEFAULT_LOCALE));
    await page
        .getByRole("banner")
        .getByRole("button", { name: themeName })
        .click();
    await page.setViewportSize(PHONE);

    await expect(iconOf(page, OTHER_MODE)).toBeHidden();
    await expect(iconOf(page, theme.defaultMode)).toBeVisible();
});

for (const locale of OTHER_LOCALES) {
    test(`should lead to the ${locale} page from the language links`, async ({
        page,
    }) => {
        await page.setViewportSize(DESKTOP);
        await page.goto(pathFor(DEFAULT_LOCALE));

        const languages = page.getByRole("group", {
            name: ui.languages[DEFAULT_LOCALE],
        });

        await languages
            .getByRole("link", { name: LOCALE_META[locale].name })
            .click();

        await expect(page).toHaveURL((url) => url.pathname === pathFor(locale));
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(
            page
                .getByRole("group", { name: ui.languages[locale] })
                .getByRole("link", { name: LOCALE_META[locale].name }),
        ).toHaveAttribute("aria-current", "page");
    });
}
