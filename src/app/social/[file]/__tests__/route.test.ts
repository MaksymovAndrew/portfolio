/** @jest-environment node */
import { ImageResponse } from "next/og";

import { SOCIAL_IMAGE } from "constants/social";

import { theme } from "theme/theme";

import { getContent } from "i18n/content";
import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";

import { generateStaticParams, GET } from "app/social/[file]/route";

jest.mock("next/og", () => ({ ImageResponse: jest.fn() }));

const REQUEST = new Request("https://example.com/");

const draw = (file: string) =>
    GET(REQUEST, { params: Promise.resolve({ file }) });

describe("social image route", () => {
    it("should prebuild one card per language", () => {
        expect(generateStaticParams()).toEqual(
            LOCALES.map((locale) => ({ file: `${locale}.png` })),
        );
    });

    it("should draw the card in the language of the file name", async () => {
        const locale = LOCALES.at(-1) ?? DEFAULT_LOCALE;
        const { hero, profile } = getContent(locale);

        await draw(`${locale}.png`);

        const [card, options] = jest.mocked(ImageResponse).mock.calls[0] ?? [];

        expect(card?.props).toMatchObject({
            eyebrow: hero.eyebrow,
            name: profile.name,
            tagline: hero.tagline,
            chips: hero.chips,
            palette: theme.modes[theme.social.mode].palette,
        });
        expect(options).toMatchObject({
            width: SOCIAL_IMAGE.width,
            height: SOCIAL_IMAGE.height,
        });
        expect(options?.fonts).toHaveLength(3);
    });

    it("should answer 404 for an unknown language", async () => {
        const response = await draw("xx.png");

        expect(response.status).toBe(404);
        expect(jest.mocked(ImageResponse).mock.calls).toEqual([]);
    });
});
