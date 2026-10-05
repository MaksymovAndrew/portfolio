import { LOCALES, pathFor } from "./support/site";
import { expect, test } from "./support/test";

// what a text shows when its markup was not parsed
const RAW_MARKUP = ["**", "]("];

for (const locale of LOCALES) {
    test(`should serve the prerendered ${locale} page`, async ({ page }) => {
        const response = await page.goto(pathFor(locale));

        expect(response?.status()).toBe(200);
        expect(response?.headers()).toHaveProperty("x-nextjs-prerender");
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
    });

    test(`should show no raw markup on the ${locale} page`, async ({
        page,
    }) => {
        await page.goto(pathFor(locale));

        for (const marker of RAW_MARKUP) {
            await expect(page.locator("body")).not.toContainText(marker, {
                useInnerText: true,
            });
        }
    });
}

test("should answer the health check", async ({ request }) => {
    const response = await request.get("/health");

    expect(response.status()).toBe(200);
    expect(await response.text()).toBe("ok");
});
