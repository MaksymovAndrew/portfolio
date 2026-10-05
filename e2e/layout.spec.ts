import { LOCALES, pathFor, VIEWPORT_HEIGHT, WIDTHS } from "./support/site";
import { expect, settle, test } from "./support/test";

for (const width of WIDTHS) {
    test.describe(`at ${width}px`, () => {
        test.use({ viewport: { width, height: VIEWPORT_HEIGHT } });

        for (const locale of LOCALES) {
            test(`should not scroll sideways in ${locale}`, async ({
                page,
            }) => {
                await page.goto(pathFor(locale));
                await settle(page);

                const overflow = await page.evaluate(
                    () =>
                        document.documentElement.scrollWidth -
                        document.documentElement.clientWidth,
                );

                expect(overflow).toBeLessThanOrEqual(0);
            });
        }
    });
}
