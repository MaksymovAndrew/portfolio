import { source } from "content";
import { LOCALE_META } from "content/locales";
import { theme } from "theme/theme";

import {
    DEFAULT_LOCALE,
    LOCALES,
    missingPathFor,
    pathFor,
} from "./support/site";
import { expect, NOT_FOUND, test } from "./support/test";

for (const locale of LOCALES) {
    test(`should show the ${locale} content without JavaScript`, async ({
        page,
    }) => {
        await page.goto(pathFor(locale));

        const main = page.getByRole("main");

        await expect(main).toBeVisible();
        await expect(main).toHaveText(/\S/, { useInnerText: true });
    });

    test(`should show the ${locale} 404 page without JavaScript`, async ({
        page,
    }) => {
        const response = await page.goto(missingPathFor(locale));

        expect(response?.status()).toBe(NOT_FOUND);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("main").getByRole("link")).toHaveAttribute(
            "href",
            pathFor(locale),
        );
    });
}

for (const locale of LOCALES.filter((other) => other !== DEFAULT_LOCALE)) {
    test(`should switch to ${locale} without JavaScript`, async ({ page }) => {
        await page.goto(pathFor(DEFAULT_LOCALE));
        await page
            .getByRole("group", { name: source.ui.languages[DEFAULT_LOCALE] })
            .getByRole("link", { name: LOCALE_META[locale].name })
            .click();

        await expect(page).toHaveURL((url) => url.pathname === pathFor(locale));
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
}

test("should hide the theme switch and keep the default colours without JavaScript", async ({
    page,
}) => {
    await page.goto(pathFor(DEFAULT_LOCALE));

    await expect(
        page.getByRole("button", { name: source.ui.theme[DEFAULT_LOCALE] }),
    ).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        theme.defaultMode,
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
        "content",
        theme.modes[theme.defaultMode].palette.bg,
    );
});

test("should hide the copy button and keep the mail link without JavaScript", async ({
    page,
}) => {
    await page.goto(pathFor(DEFAULT_LOCALE));

    await expect(
        page.getByRole("button", {
            name: source.ui.copy.label[DEFAULT_LOCALE],
        }),
    ).toBeHidden();
    await expect(
        page.getByRole("link", { name: source.profile.email, exact: true }),
    ).toHaveAttribute("href", `mailto:${source.profile.email}`);
});
