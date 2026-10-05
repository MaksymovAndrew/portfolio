import { expectAccessible } from "./support/axe";
import { LOCALES, pathFor, VIEWPORT_HEIGHT } from "./support/site";
import { test } from "./support/test";

// a phone and a desktop: the two layouts differ the most
const AUDITED_WIDTHS = [375, 1440] as const;

for (const width of AUDITED_WIDTHS) {
    test.describe(`at ${width}px`, () => {
        test.use({ viewport: { width, height: VIEWPORT_HEIGHT } });

        for (const locale of LOCALES) {
            test(`should pass the accessibility rules in ${locale}`, async ({
                page,
            }) => {
                await page.goto(pathFor(locale));

                await expectAccessible(page);
            });
        }
    });
}
