import { render, screen } from "@testing-library/react";

import { Achievements } from "components/sections/Achievements";

import { toPlainText } from "utils/inline";

import { content } from "test/fixtures/content";

const { achievements } = content;

const ITEMS = [...achievements.items, "Wrote the release notes"];

const withItems = (items: readonly string[]) => ({
    ...content,
    achievements: { ...achievements, items },
});

describe("Achievements", () => {
    it("should head the section with its label", () => {
        render(<Achievements content={content} />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "shipped",
        );
    });

    it("should show the file name in the window bar", () => {
        render(<Achievements content={content} />);

        expect(screen.getByText(achievements.fileName)).toBeInTheDocument();
    });

    it("should list every item with its emphasis", () => {
        render(<Achievements content={withItems(ITEMS)} />);

        const list = screen.getByRole("list");

        for (const item of ITEMS) {
            expect(list).toHaveTextContent(toPlainText(item));
        }
        expect(screen.getByRole("strong")).toHaveTextContent("half");
    });
});
