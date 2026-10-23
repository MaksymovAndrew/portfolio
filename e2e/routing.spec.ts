import { ui } from "content/ui";

import type { Locale } from "i18n/locales";

import { expectAccessible } from "./support/axe";
import {
    DEFAULT_LOCALE,
    localePath,
    LOCALES,
    missingPathFor,
    OTHER_LOCALES,
    OTHER_MODE,
    VIEWPORT_HEIGHT,
} from "./support/site";
import { expect, NOT_FOUND, storeTheme, test } from "./support/test";

const PERMANENT_REDIRECT = 308;

// files bots probe for: a dot keeps them from the proxy, and no language matches them
const PROBED_FILES = ["/wp-login.php", "/xmlrpc.php"];

const NOT_FOUND_CASES: readonly { path: string; locale: Locale }[] = [
    ...LOCALES.map((locale) => ({ path: missingPathFor(locale), locale })),
    // a language code in another case is no language at all
    { path: `/${DEFAULT_LOCALE.toUpperCase()}`, locale: DEFAULT_LOCALE },
    // an old file address under a language prefix
    ...OTHER_LOCALES.map((locale) => ({
        path: `${localePath(locale)}/old.pdf`,
        locale,
    })),
];

test("should move the default language's prefix to the root", async ({
    request,
}) => {
    const missing = missingPathFor(DEFAULT_LOCALE);
    const home = await request.get(`/${DEFAULT_LOCALE}`, { maxRedirects: 0 });
    const page = await request.get(`/${DEFAULT_LOCALE}${missing}`, {
        maxRedirects: 0,
    });

    expect(home.status()).toBe(PERMANENT_REDIRECT);
    expect(home.headers().location).toBe("/");
    expect(page.status()).toBe(PERMANENT_REDIRECT);
    expect(page.headers().location).toBe(missing);
});

for (const locale of OTHER_LOCALES) {
    test(`should drop the trailing slash of the ${locale} page`, async ({
        request,
    }) => {
        const response = await request.get(`${localePath(locale)}/`, {
            maxRedirects: 0,
        });

        expect(response.status()).toBe(PERMANENT_REDIRECT);
        expect(response.headers().location).toBe(localePath(locale));
    });
}

for (const { path, locale } of NOT_FOUND_CASES) {
    test(`should answer ${path} with the ${locale} 404 page`, async ({
        page,
    }) => {
        const response = await page.goto(path);

        expect(response?.status()).toBe(NOT_FOUND);
        expect(response?.headers()).toHaveProperty("x-nextjs-prerender");
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByRole("main").getByRole("link")).toHaveAttribute(
            "href",
            localePath(locale),
        );
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            "content",
            "noindex",
        );
        await expectAccessible(page);
    });
}

for (const path of PROBED_FILES) {
    test(`should answer ${path} with the site's own 404 page`, async ({
        page,
    }) => {
        await storeTheme(page, OTHER_MODE);
        const response = await page.goto(path);

        expect(response?.status()).toBe(NOT_FOUND);
        await expect(page.locator("html")).toHaveAttribute(
            "lang",
            DEFAULT_LOCALE,
        );
        await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            OTHER_MODE,
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            ui.notFound.heading[DEFAULT_LOCALE],
        );
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            "content",
            "noindex",
        );
        await expectAccessible(page);
    });
}

// the bar of the home page hides from 1024; the 404 page has no left column to take its place
for (const width of [375, 1440]) {
    test.describe(`at ${width}px`, () => {
        test.use({ viewport: { width, height: VIEWPORT_HEIGHT } });

        for (const locale of LOCALES) {
            test(`should show the ${locale} 404 page under the top bar`, async ({
                page,
            }) => {
                await page.goto(missingPathFor(locale));

                await expect(page.getByRole("banner")).toBeVisible();
                await expect(
                    page.getByRole("heading", { level: 1 }),
                ).toHaveText(ui.notFound.heading[locale]);
                await expect(page).toHaveTitle(ui.notFound.title[locale]);
            });
        }
    });
}
