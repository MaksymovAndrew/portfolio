import type { Page } from "@playwright/test";

import { LOCALE_META } from "content/locales";
import { profile } from "content/profile";

import {
    DEFAULT_LOCALE,
    localePath,
    LOCALES,
    missingPathFor,
} from "./support/site";
import { expect, test } from "./support/test";

const HREFLANGS = [...LOCALES, "x-default"].sort();

const OPEN_GRAPH = [
    "og:title",
    "og:description",
    "og:url",
    "og:site_name",
    "og:locale",
];

// one form of every address, so "https://site" and "https://site/" compare equal
const normalize = (href: string): string => new URL(href).href;

const absolute = (path: string, baseURL: string | undefined): string =>
    new URL(path, baseURL).href;

const alternatesOf = (page: Page) =>
    page.locator('head link[rel="alternate"][hreflang]').evaluateAll((links) =>
        links.map((link) => ({
            hreflang: link.getAttribute("hreflang") ?? "",
            href: link.getAttribute("href") ?? "",
        })),
    );

// the server's HTML as a crawler reads it: no script runs and changes it
test.use({ javaScriptEnabled: false });

for (const locale of LOCALES) {
    test(`should describe the ${locale} page in its head`, async ({
        page,
        baseURL,
    }) => {
        await page.goto(localePath(locale));

        const canonical = page.locator('head link[rel="canonical"]');

        await expect(canonical).toHaveCount(1);
        expect(normalize((await canonical.getAttribute("href")) ?? "")).toBe(
            absolute(localePath(locale), baseURL),
        );

        for (const property of OPEN_GRAPH) {
            await expect(
                page.locator(`head meta[property="${property}"]`),
            ).toHaveAttribute("content", /\S/);
        }

        await expect(
            page.locator('head meta[property="og:locale"]'),
        ).toHaveAttribute("content", LOCALE_META[locale].openGraph);
        await expect(
            page.locator('head meta[name="twitter:card"]'),
        ).toHaveAttribute("content", "summary_large_image");
        await expect(page.locator("body meta, body link")).toHaveCount(0);
    });

    test(`should describe the person behind the ${locale} page`, async ({
        page,
    }) => {
        await page.goto(localePath(locale));

        // in the body, next to the content it describes; crawlers read it anywhere
        const script = page.locator('script[type="application/ld+json"]');

        await expect(script).toHaveCount(1);

        const data = await script.textContent();

        expect(JSON.parse(data ?? "")).toMatchObject({
            "@type": "ProfilePage",
            inLanguage: locale,
            mainEntity: { "@type": "Person", name: profile.name },
        });
    });

    test(`should not present the ${locale} 404 page as a copy of the home page`, async ({
        page,
    }) => {
        await page.goto(missingPathFor(locale));

        await expect(
            page.locator(
                'link[rel="canonical"], link[rel="alternate"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]',
            ),
        ).toHaveCount(0);
    });
}

test("should give every page the same set of language alternates", async ({
    page,
    baseURL,
}) => {
    const sets: string[][] = [];

    for (const locale of LOCALES) {
        await page.goto(localePath(locale));
        sets.push(
            (await alternatesOf(page))
                .map(({ hreflang, href }) => `${hreflang} ${normalize(href)}`)
                .sort(),
        );
    }

    const [first] = sets;

    expect(first.map((entry) => entry.split(" ")[0]).sort()).toEqual(HREFLANGS);
    expect(first).toContain(
        `x-default ${absolute(localePath(DEFAULT_LOCALE), baseURL)}`,
    );

    for (const set of sets) {
        expect(set).toEqual(first);
    }
});

test("should let crawlers in and point them to the sitemap", async ({
    request,
    baseURL,
}) => {
    const robots = await (await request.get("/robots.txt")).text();

    expect(robots).toContain("Allow: /");
    expect(robots).toContain(`Sitemap: ${absolute("/sitemap.xml", baseURL)}`);
});

test("should list every language in the sitemap with its alternates", async ({
    request,
    baseURL,
}) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const addresses = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
        ([, href]) => normalize(href),
    );

    expect(addresses).toEqual(
        LOCALES.map((locale) => absolute(localePath(locale), baseURL)),
    );
    expect(sitemap.match(/<xhtml:link /g)).toHaveLength(
        LOCALES.length * HREFLANGS.length,
    );
});

test("should serve a manifest with icons that exist", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    const manifest = (await response.json()) as {
        name: string;
        icons: { src: string; sizes: string }[];
    };

    expect(response.ok()).toBe(true);
    expect(manifest.name).toBe(profile.name);
    expect(manifest.icons.map((icon) => icon.sizes)).toEqual([
        "192x192",
        "512x512",
    ]);

    for (const icon of manifest.icons) {
        const png = await (await request.get(icon.src)).body();

        expect(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`).toBe(
            icon.sizes,
        );
    }
});
