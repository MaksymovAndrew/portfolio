import { source } from "content";

import { localePath, LOCALES } from "./support/site";
import { expect, test } from "./support/test";

const { cv } = source.profile;

test("should serve the CV as a PDF", async ({ request }) => {
    const response = await request.get(cv.href);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
});

for (const locale of LOCALES) {
    test(`should offer the CV as a download on the ${locale} page`, async ({
        page,
    }) => {
        await page.goto(localePath(locale));

        const links = page.locator(`a[href="${cv.href}"]`);

        await expect(links.first()).toHaveAttribute("download", "");
        await expect(
            page.locator(`a[href="${cv.href}"]:not([download])`),
        ).toHaveCount(0);
    });
}
