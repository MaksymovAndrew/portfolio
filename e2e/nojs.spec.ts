import { source } from "content";
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
