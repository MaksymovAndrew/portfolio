import { LOCALES, pathFor } from "./support/site";
import { expect, test } from "./support/test";

for (const locale of LOCALES) {
    test(`should serve the prerendered ${locale} page`, async ({ page }) => {
        const response = await page.goto(pathFor(locale));

        expect(response?.status()).toBe(200);
        expect(response?.headers()).toHaveProperty("x-nextjs-prerender");
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });
}

test("should answer the health check", async ({ request }) => {
    const response = await request.get("/health");

    expect(response.status()).toBe(200);
    expect(await response.text()).toBe("ok");
});
