import { expectAccessible } from "./support/axe";
import {
    LOCALES,
    missingPathFor,
    pathFor,
    THEMES,
    VIEWPORT_HEIGHT,
} from "./support/site";
import { storeTheme, test } from "./support/test";

// a phone and a desktop: the two layouts differ the most
const AUDITED_WIDTHS = [375, 1440] as const;

for (const width of AUDITED_WIDTHS) {
    test.describe(`at ${width}px`, () => {
        test.use({ viewport: { width, height: VIEWPORT_HEIGHT } });

        for (const mode of THEMES) {
            for (const locale of LOCALES) {
                const pages = [
                    { name: locale, path: pathFor(locale) },
                    { name: `${locale} 404`, path: missingPathFor(locale) },
                ];

                for (const { name, path } of pages) {
                    test(`should pass the accessibility rules in ${name}, ${mode}`, async ({
                        page,
                    }) => {
                        await storeTheme(page, mode);
                        await page.goto(path);

                        await expectAccessible(page);
                    });
                }
            }
        }
    });
}
