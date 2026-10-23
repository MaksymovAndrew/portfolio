import {
    localePath,
    LOCALES,
    missingPathFor,
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
                const pages = [
                    { name: locale, path: localePath(locale) },
                    { name: `${locale} 404`, path: missingPathFor(locale) },
                ];

                for (const { name, path } of pages) {
                    test(`should not scroll sideways in ${name}, ${mode}`, async ({
                        page,
                    }) => {
                        await storeTheme(page, mode);
                        await page.goto(path);
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
        }
    });
}
