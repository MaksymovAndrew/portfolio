import "server-only";

import { statSync } from "node:fs";
import path from "node:path";

import type { Content, ContentSource } from "types/content";

import { source } from "content";

import { foldContent } from "i18n/fold";
import type { Locale } from "i18n/locales";
import type { PublicFiles } from "i18n/validate";
import { assertValidContent } from "i18n/validate";

// the build runs from the project root
export const publicFiles: PublicFiles = {
    exists: (publicPath) =>
        statSync(path.join(process.cwd(), "public", publicPath), {
            throwIfNoEntry: false,
        })?.isFile() ?? false,
};

const cache = new Map<Locale, Content>();

// the first page of a build checks the whole content, so broken content fails the build
export const getContent = (locale: Locale): Content => {
    const cached = cache.get(locale);

    if (cached) {
        return cached;
    }

    if (cache.size === 0) {
        assertValidContent(source, publicFiles);
    }

    const content = { ...foldContent<ContentSource>(source, locale), locale };

    cache.set(locale, content);

    return content;
};
