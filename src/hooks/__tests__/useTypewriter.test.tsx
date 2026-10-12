import { act, render, screen } from "@testing-library/react";

import { OUTPUT_DELAY_MS, TYPE_DELAY_MIN_MS } from "constants/timing";

import { useTypewriter } from "hooks/useTypewriter";

const COMMANDS = [
    { command: "ls", result: "two files" },
    { command: "pwd", result: "/home" },
];

interface HarnessProps {
    paused: boolean;
}

const Harness = ({ paused }: HarnessProps) => {
    const { typed, output } = useTypewriter(COMMANDS, paused);

    return (
        <>
            <span data-testid="typed">{typed}</span>
            <span data-testid="output">{output}</span>
        </>
    );
};

const shown = () => [
    screen.getByTestId("typed").textContent,
    screen.getByTestId("output").textContent,
];

const advance = (ms: number) => {
    act(() => {
        jest.advanceTimersByTime(ms);
    });
};

describe("useTypewriter", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // every character then takes the shortest delay
        jest.spyOn(Math, "random").mockImplementation(() => 0);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should advance through the frames", () => {
        render(<Harness paused={false} />);

        advance(0);
        expect(shown()).toEqual(["", ""]);

        advance(TYPE_DELAY_MIN_MS);
        expect(shown()).toEqual(["l", ""]);

        advance(TYPE_DELAY_MIN_MS);
        expect(shown()).toEqual(["ls", ""]);

        advance(OUTPUT_DELAY_MS);
        expect(shown()).toEqual(["ls", "two files"]);
    });

    it("should show the first command with its result when paused", () => {
        const { rerender } = render(<Harness paused={false} />);

        advance(TYPE_DELAY_MIN_MS);
        rerender(<Harness paused />);

        expect(shown()).toEqual(["ls", "two files"]);

        advance(OUTPUT_DELAY_MS * 10);
        expect(shown()).toEqual(["ls", "two files"]);
    });
});
