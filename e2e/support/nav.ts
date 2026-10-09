import type { Locator, Page } from "@playwright/test";

import { source } from "content";

import { DEFAULT_LOCALE } from "./site";
import { expect } from "./test";

const { ui } = source;

// the sections with a navigation link, in their configured order
export const NAV_ITEMS = source.site.sections.flatMap((id) => {
    const { nav } = source[id];

    return nav === null ? [] : [{ id, label: nav[DEFAULT_LOCALE] }];
});

export const [FIRST_ITEM] = NAV_ITEMS;
export const LAST_ITEM = NAV_ITEMS.at(-1) ?? FIRST_ITEM;

// what the current link of either navigation says about itself
export const expectCurrent = (link: Locator) =>
    expect(link).toHaveAttribute("aria-current", "location");

export const sectionNav = (page: Page) =>
    page.getByRole("navigation", { name: ui.sections[DEFAULT_LOCALE] });

export const menuButton = (page: Page) =>
    page.getByRole("button", { name: ui.menu.open[DEFAULT_LOCALE] });

export const sheet = (page: Page) =>
    page.getByRole("dialog", { name: ui.menu.title[DEFAULT_LOCALE] });

export const backToTop = (page: Page) =>
    page.getByRole("button", { name: ui.backToTop[DEFAULT_LOCALE] });

// the top of the section at the top of the window, as a reader scrolling down would bring it
export const scrollToSection = async (page: Page, id: string) => {
    await page.locator(`#${id}`).evaluate((section) => {
        section.scrollIntoView();
    });
};
