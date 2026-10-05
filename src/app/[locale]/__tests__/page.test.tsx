import { render, screen } from "@testing-library/react";

import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";

import HomePage from "app/[locale]/page";

describe("HomePage", () => {
    it("should show the locale it was built for", async () => {
        const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;

        render(await HomePage({ params: Promise.resolve({ locale }) }));

        expect(screen.getByText(locale)).toBeInTheDocument();
    });
});
