import { render, screen } from "@testing-library/react";

import { getContent } from "i18n/content";
import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import MissingPage, { generateMetadata } from "app/[locale]/[...missing]/page";
import { content } from "test/fixtures/content";

describe("MissingPage", () => {
    it("should show the 404 view", () => {
        const { ui } = content;

        render(
            <SystemMessagesProvider
                value={{
                    homeHref: "/",
                    home: ui.home,
                    notFound: ui.notFound,
                    error: ui.error,
                    topBar: null,
                }}
            >
                <MissingPage />
            </SystemMessagesProvider>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            ui.notFound.heading,
        );
    });

    it("should name the page after the 404 title and keep it out of search", async () => {
        const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;
        const { ui } = getContent(locale);

        expect(
            await generateMetadata({ params: Promise.resolve({ locale }) }),
        ).toEqual({
            title: ui.notFound.title,
            description: ui.notFound.text,
            robots: { index: false },
            alternates: null,
            openGraph: null,
            twitter: null,
        });
    });

    it("should answer 404 for a language that is not configured", async () => {
        const locale = `${LOCALES.join("")}x`;

        await expect(
            generateMetadata({ params: Promise.resolve({ locale }) }),
        ).rejects.toThrow("404");
    });
});
