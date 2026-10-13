import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { SOCIAL_IMAGE, SOCIAL_IMAGE_EXTENSION } from "constants/social";

import { theme } from "theme/theme";

import { SOCIAL_FONTS, SocialCard } from "components/social/SocialCard";
import { getContent } from "i18n/content";
import { isLocale, LOCALES } from "i18n/locales";

interface SocialImageContext {
    params: Promise<{ file: string }>;
}

const NOT_FOUND = 404;

// static instances with every alphabet: the image renderer cannot read variable fonts or woff2
const fontFile = (name: string) =>
    readFile(path.join(process.cwd(), "theme", "fonts", name));

const loadFonts = async () => [
    {
        name: SOCIAL_FONTS.display,
        data: await fontFile("Unbounded-Bold.ttf"),
        weight: 700 as const,
        style: "normal" as const,
    },
    {
        name: SOCIAL_FONTS.body,
        data: await fontFile("Manrope-SemiBold.ttf"),
        weight: 600 as const,
        style: "normal" as const,
    },
    {
        name: SOCIAL_FONTS.mono,
        data: await fontFile("JetBrainsMono-Medium.ttf"),
        weight: 500 as const,
        style: "normal" as const,
    },
];

// drawn at build time, one card per language; any other file answers 404 before this runs
export const dynamicParams = false;

export const generateStaticParams = () =>
    LOCALES.map((locale) => ({ file: `${locale}${SOCIAL_IMAGE_EXTENSION}` }));

export const GET = async (
    _request: Request,
    { params }: SocialImageContext,
): Promise<Response> => {
    const { file } = await params;
    const locale = file.slice(0, -SOCIAL_IMAGE_EXTENSION.length);

    if (!file.endsWith(SOCIAL_IMAGE_EXTENSION) || !isLocale(locale)) {
        return new Response(null, { status: NOT_FOUND });
    }

    const { hero, profile } = getContent(locale);
    const { palette, tints } = theme.modes[theme.social.mode];

    return new ImageResponse(
        <SocialCard
            eyebrow={hero.eyebrow}
            name={profile.name}
            tagline={hero.tagline}
            chips={hero.chips}
            initials={profile.initials}
            palette={palette}
            tints={tints}
            glow={theme.glow}
        />,
        {
            width: SOCIAL_IMAGE.width,
            height: SOCIAL_IMAGE.height,
            fonts: await loadFonts(),
        },
    );
};
