import {
    DEFAULT_LOCALE,
    localePath,
    LOCALES,
    missingPathFor,
} from "./support/site";
import { expect, NOT_FOUND, test } from "./support/test";

// the production values; the development server adds what its live reload needs
const HEADERS = {
    "content-security-policy":
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy":
        "camera=(), microphone=(), geolocation=(), payment=()",
    "cross-origin-opener-policy": "same-origin",
};

const OK = 200;

// pages, the 404 rewrite, route handlers and the files the proxy leaves alone
const ADDRESSES = [
    ...LOCALES.map((locale) => ({ path: localePath(locale), status: OK })),
    { path: missingPathFor(DEFAULT_LOCALE), status: NOT_FOUND },
    { path: "/health", status: OK },
    { path: `/social/${DEFAULT_LOCALE}.png`, status: OK },
    { path: "/icon/32", status: OK },
    { path: "/manifest.webmanifest", status: OK },
];

const SCRIPT_FILE = /\/_next\/static\/[^"]+\.js/;

for (const { path, status } of ADDRESSES) {
    test(`should answer ${path} with the security headers`, async ({
        request,
    }) => {
        const response = await request.get(path);

        expect(response.status()).toBe(status);
        expect(response.headers()).toMatchObject(HEADERS);
        expect(response.headers()).not.toHaveProperty("x-powered-by");
    });
}

test("should send the security headers with the build's own files", async ({
    request,
}) => {
    const page = await (await request.get(localePath(DEFAULT_LOCALE))).text();
    const [script = ""] = SCRIPT_FILE.exec(page) ?? [];
    const response = await request.get(script);

    expect(response.status()).toBe(OK);
    expect(response.headers()).toMatchObject(HEADERS);
});
