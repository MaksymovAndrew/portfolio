import { readFileSync } from "node:fs";

import { LOCALES, pathFor } from "./support/site";
import { expect, test } from "./support/test";

const CARD = { width: 1200, height: 630 };
const MAX_BYTES = 300 * 1024;

// the release the build was made from: platforms refetch the card when it changes
const { version } = JSON.parse(readFileSync("package.json", "utf8")) as {
    version: string;
};

// a PNG states its size in the IHDR chunk, right after the signature
const pngSize = (png: Buffer) => ({
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
});

// the server's HTML as a platform reads it when a link is shared
test.use({ javaScriptEnabled: false });

for (const locale of LOCALES) {
    test(`should draw the ${locale} preview card at the wide size`, async ({
        request,
    }) => {
        const response = await request.get(`/social/${locale}.png`);
        const png = await response.body();

        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toBe("image/png");
        expect(pngSize(png)).toEqual(CARD);
        expect(png.length).toBeLessThan(MAX_BYTES);
    });

    test(`should point the ${locale} page's previews at its card`, async ({
        page,
        request,
    }) => {
        await page.goto(pathFor(locale));

        const image = page.locator('head meta[property="og:image"]');
        const address = new URL((await image.getAttribute("content")) ?? "");

        expect(address.pathname).toBe(`/social/${locale}.png`);
        expect(address.searchParams.get("v")).toBe(version);
        await expect(
            page.locator('head meta[name="twitter:image"]'),
        ).toHaveAttribute("content", address.href);
        await expect(
            page.locator('head meta[property="og:image:width"]'),
        ).toHaveAttribute("content", String(CARD.width));
        await expect(
            page.locator('head meta[property="og:image:height"]'),
        ).toHaveAttribute("content", String(CARD.height));
        await expect(
            page.locator('head meta[property="og:image:type"]'),
        ).toHaveAttribute("content", "image/png");
        await expect(
            page.locator('head meta[property="og:image:alt"]'),
        ).toHaveAttribute("content", /\S/);

        const response = await request.get(
            `${address.pathname}${address.search}`,
        );

        expect(response.status()).toBe(200);
    });
}
