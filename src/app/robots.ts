import type { MetadataRoute } from "next";

import { SITE_URL } from "config/site";

const robots = (): MetadataRoute.Robots => ({
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
});

export default robots;
