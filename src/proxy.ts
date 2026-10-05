import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { NOT_FOUND_SEGMENT, PAGES } from "constants/routes";

import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";
import { createLocaleRouting } from "i18n/routing";

const PERMANENT_REDIRECT = 308;
const NOT_FOUND = 404;

const routing = createLocaleRouting({
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    pages: PAGES,
    notFoundSegment: NOT_FOUND_SEGMENT,
});

// every page lives under app/[locale]; the default language is served there without its prefix
export const proxy = (request: NextRequest): NextResponse => {
    const route = routing.resolve(request.nextUrl.pathname);

    if (route.kind === "pass") {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();

    url.pathname = route.pathname;

    if (route.kind === "redirect") {
        return NextResponse.redirect(url, PERMANENT_REDIRECT);
    }

    // the prebuilt 404 page answers 200 by itself; the status comes from here
    return route.kind === "notFound"
        ? NextResponse.rewrite(url, { status: NOT_FOUND })
        : NextResponse.rewrite(url);
};

// not pages (build files, the health check, icons, any file with an extension): they have no language
export const config = {
    matcher: ["/((?!_next/|health$|(?:apple-)?icon(?:$|/)|.*\\.).*)"],
};
