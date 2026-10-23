import type { Metadata } from "next";

import { NotFoundView } from "components/layout/NotFoundView";
import { getContent } from "i18n/content";
import { DEFAULT_LOCALE } from "i18n/locales";

import { buildNotFoundMetadata } from "utils/metadata";

import { RootDocument } from "app/RootDocument";

// Next writes the noindex of a 404 here itself
export const metadata: Metadata = {
    ...buildNotFoundMetadata(getContent(DEFAULT_LOCALE)),
    robots: null,
};

// an address outside every language, such as a file a bot probes for, never reaches the root layout
const GlobalNotFound = () => (
    <RootDocument locale={DEFAULT_LOCALE}>
        <NotFoundView />
    </RootDocument>
);

export default GlobalNotFound;
