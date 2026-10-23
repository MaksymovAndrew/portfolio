import { act, render, screen } from "@testing-library/react";

import { useMediaQuery } from "hooks/useMediaQuery";

import { matchMedia } from "test/shims/matchMedia";

const QUERY = "(width >= 1024px)";

const Harness = () => (
    <span data-testid="matches">{String(useMediaQuery(QUERY))}</span>
);

const matches = () => screen.getByTestId("matches").textContent;

describe("useMediaQuery", () => {
    it("should follow the query while the page is open", () => {
        render(<Harness />);

        expect(matches()).toBe("false");

        act(() => {
            matchMedia(QUERY);
        });

        expect(matches()).toBe("true");
    });
});
