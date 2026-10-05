import { source } from "content";
import { theme } from "theme/theme";

import { DEFAULT_LOCALE, pathFor, THEMES } from "./support/site";
import { expect, settle, storeTheme, test } from "./support/test";

const THEME_COLOR = 'meta[name="theme-color"]';
const THEME_ATTRIBUTE = "data-theme";

const OTHER_MODE =
    THEMES.find((mode) => mode !== theme.defaultMode) ?? theme.defaultMode;

const backgroundOf = (mode: (typeof THEMES)[number]) =>
    theme.modes[mode].palette.bg;

// how a computed style reports a hex colour
const rgbOf = (hex: string) =>
    `rgb(${(hex.slice(1).match(/../g) ?? [])
        .map((pair) => Number.parseInt(pair, 16))
        .join(", ")})`;

test("should open in the default theme", async ({ page }) => {
    await page.goto(pathFor(DEFAULT_LOCALE));

    await expect(page.locator("html")).toHaveAttribute(
        THEME_ATTRIBUTE,
        theme.defaultMode,
    );
    await expect(page.locator(THEME_COLOR)).toHaveAttribute(
        "content",
        backgroundOf(theme.defaultMode),
    );
});

test("should switch the theme and keep the choice after a reload", async ({
    page,
}) => {
    await page.goto(pathFor(DEFAULT_LOCALE));
    await page
        .getByRole("button", { name: source.ui.theme[DEFAULT_LOCALE] })
        .click();

    await expect(page.locator("html")).toHaveAttribute(
        THEME_ATTRIBUTE,
        OTHER_MODE,
    );
    await expect(page.locator(THEME_COLOR)).toHaveAttribute(
        "content",
        backgroundOf(OTHER_MODE),
    );

    await page.reload();
    await settle(page);

    await expect(page.locator("html")).toHaveAttribute(
        THEME_ATTRIBUTE,
        OTHER_MODE,
    );
    // one tag after hydration: a locator that finds two fails here
    await expect(page.locator(THEME_COLOR)).toHaveAttribute(
        "content",
        backgroundOf(OTHER_MODE),
    );
});

test("should apply a stored theme before any bundle runs", async ({ page }) => {
    // every bundle answers empty: only the inline pre-paint script is left to act
    await page.route("**/_next/static/**/*.js", (route) =>
        route.fulfill({ contentType: "text/javascript", body: "" }),
    );
    await storeTheme(page, OTHER_MODE);
    await page.goto(pathFor(DEFAULT_LOCALE));

    await expect(page.locator("html")).toHaveAttribute(
        THEME_ATTRIBUTE,
        OTHER_MODE,
    );
    await expect(page.locator("html")).toHaveCSS(
        "background-color",
        rgbOf(backgroundOf(OTHER_MODE)),
    );
});

test("should serve every icon the page links at its size", async ({
    page,
    request,
}) => {
    await page.goto(pathFor(DEFAULT_LOCALE));

    const icons = await page
        .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
        .evaluateAll((links) =>
            links.map((link) => ({
                href: link.getAttribute("href") ?? "",
                sizes: link.getAttribute("sizes") ?? "",
            })),
        );

    expect(icons.length).toBeGreaterThan(0);

    for (const { href, sizes } of icons) {
        const response = await request.get(href);
        // a PNG keeps its width and height right after the signature
        const png = await response.body();

        expect(response.headers()["content-type"]).toBe("image/png");
        expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe(sizes);
    }
});
