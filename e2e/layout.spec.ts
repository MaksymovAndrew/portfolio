import {
    LOCALES,
    pathFor,
    THEMES,
    VIEWPORT_HEIGHT,
    WIDTHS,
} from "./support/site";
import { expect, settle, storeTheme, test } from "./support/test";

for (const width of WIDTHS) {
    test.describe(`at ${width}px`, () => {
        test.use({ viewport: { width, height: VIEWPORT_HEIGHT } });

        for (const mode of THEMES) {
            for (const locale of LOCALES) {
                test(`should not scroll sideways in ${locale}, ${mode}`, async ({
                    page,
                }) => {
                    await storeTheme(page, mode);
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
        }
    });
}
