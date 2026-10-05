import { expectAccessible } from "./support/axe";
import {
    DEFAULT_LOCALE,
    LOCALES,
    missingPathFor,
    pathFor,
} from "./support/site";
import { expect, NOT_FOUND, test } from "./support/test";

const PERMANENT_REDIRECT = 308;

const OTHER_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

const NOT_FOUND_CASES = [
    ...LOCALES.map((locale) => ({ path: missingPathFor(locale), locale })),
    // a language code in another case is no language at all
    { path: `/${DEFAULT_LOCALE.toUpperCase()}`, locale: DEFAULT_LOCALE },
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
        const response = await request.get(`${pathFor(locale)}/`, {
            maxRedirects: 0,
        });

        expect(response.status()).toBe(PERMANENT_REDIRECT);
        expect(response.headers().location).toBe(pathFor(locale));
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
            pathFor(locale),
        );
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            "content",
            "noindex",
        );
        await expectAccessible(page);
    });
}
