import { render, screen } from "@testing-library/react";

import { getContent } from "i18n/content";
import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";

import { toPlainText } from "utils/inline";

import HomePage from "app/[locale]/page";

describe("HomePage", () => {
    it("should show the name, tagline and sub of its language", async () => {
        const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;
        const { hero, profile } = getContent(locale);

        render(await HomePage({ params: Promise.resolve({ locale }) }));

        const main = screen.getByRole("main");

        expect(main).toHaveTextContent(profile.name);
        expect(main).toHaveTextContent(toPlainText(hero.tagline));
        expect(screen.getByText(hero.sub)).toBeInTheDocument();
    });

    it("should answer 404 for a language that is not configured", async () => {
        const locale = `${LOCALES.join("")}x`;

        await expect(
            HomePage({ params: Promise.resolve({ locale }) }),
        ).rejects.toThrow("404");
    });
});
