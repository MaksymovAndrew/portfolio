import { LOCALES, pathFor } from "./support/site";
import { expect, test } from "./support/test";

for (const locale of LOCALES) {
    test(`should show the ${locale} content without JavaScript`, async ({
        page,
    }) => {
        await page.goto(pathFor(locale));

        const main = page.getByRole("main");

        await expect(main).toBeVisible();
        await expect(main).toHaveText(/\S/, { useInnerText: true });
    });
}
