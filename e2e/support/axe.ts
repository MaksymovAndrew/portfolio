import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

import { expect, settle } from "./test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export const expectAccessible = async (page: Page): Promise<void> => {
    await settle(page);

    const { violations } = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .analyze();

    expect(
        violations.map(
            ({ id, help, nodes }) =>
                `${id} - ${help}: ${nodes.map(({ target }) => target.join(" ")).join(", ")}`,
        ),
    ).toEqual([]);
};
