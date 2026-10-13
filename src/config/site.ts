import { DEV_SITE_URL } from "constants/routes";

interface SiteEnv {
    NEXT_PUBLIC_SITE_URL?: string;
    NODE_ENV?: string;
}

const ORIGIN_ONLY =
    "NEXT_PUBLIC_SITE_URL takes an origin only, such as https://example.com: every page address starts at the root";

const parseOrigin = (value: string): URL => {
    const url = URL.parse(value);
    const isOrigin =
        url !== null && url.pathname === "/" && !url.search && !url.hash;

    if (!isOrigin) {
        throw new Error(`${ORIGIN_ONLY} (got "${value}")`);
    }

    return url;
};

// throws in production: localhost addresses would ship in every canonical and preview tag
export const resolveSiteUrl = ({
    NEXT_PUBLIC_SITE_URL: configured,
    NODE_ENV: mode,
}: SiteEnv): URL => {
    if (configured) {
        return parseOrigin(configured);
    }

    if (mode === "production") {
        throw new Error(
            "Set NEXT_PUBLIC_SITE_URL to the public origin of the site, such as https://example.com: canonical, alternate and preview addresses resolve against it",
        );
    }

    return new URL(DEV_SITE_URL);
};

// read one by one: Next inlines a public variable only where it is named in full
export const SITE_URL = resolveSiteUrl({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
});
