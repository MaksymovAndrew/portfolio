import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { theme } from "theme/theme";

import type { MonogramProps } from "components/social/Monogram";
import { Monogram, MONOGRAM_FONT } from "components/social/Monogram";
import { getContent } from "i18n/content";
import { DEFAULT_LOCALE } from "i18n/locales";

// a static instance: the image renderer cannot read variable fonts or woff2
const FONT_FILE = path.join(
    process.cwd(),
    "theme",
    "fonts",
    "Unbounded-Bold.ttf",
);

// the site icon: the initials of the default language in the colours of the default theme
export const monogramImage = async (
    size: number,
    shape: MonogramProps["shape"],
): Promise<ImageResponse> => {
    const { profile } = getContent(DEFAULT_LOCALE);

    return new ImageResponse(
        <Monogram
            initials={profile.initials}
            size={size}
            palette={theme.modes[theme.defaultMode].palette}
            shape={shape}
        />,
        {
            width: size,
            height: size,
            fonts: [
                {
                    name: MONOGRAM_FONT,
                    data: await readFile(FONT_FILE),
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );
};
