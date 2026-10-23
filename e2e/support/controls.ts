import type { Page } from "@playwright/test";

import { source } from "content";

import type { Locale } from "i18n/locales";

import { fillTemplate } from "utils/inline";

import { DEFAULT_LOCALE } from "./site";

export const themeButton = (page: Page) =>
    page.getByRole("button", { name: source.ui.theme[DEFAULT_LOCALE] });

// the button that opens a project screenshot in the viewer, counted from 0
export const thumbnail = (
    page: Page,
    index: number,
    locale: Locale = DEFAULT_LOCALE,
) =>
    page.getByRole("button", {
        name: fillTemplate(source.ui.viewer.openScreenshot[locale], {
            index: String(index + 1),
        }),
    });
