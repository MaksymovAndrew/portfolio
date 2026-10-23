import { ui } from "content/ui";

import { foldContent } from "i18n/fold";
import { DEFAULT_LOCALE } from "i18n/locales";
import { localePath } from "i18n/paths";
import type { SystemMessages } from "i18n/SystemMessages";

const { home, notFound, error } = foldContent(ui, DEFAULT_LOCALE);

// the global error page draws in the browser without the layout: one language's texts, not the whole content, and no top bar
export const fallbackMessages: SystemMessages = {
    homeHref: localePath(DEFAULT_LOCALE),
    home,
    notFound,
    error,
    topBar: null,
};
