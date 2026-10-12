import { act, render } from "@testing-library/react";

import { Terminal } from "components/decor/Terminal";

import { motionStore } from "utils/motionStore";

import { intersectAll } from "test/shims/intersectionObserver";

const COMMAND = "npm test";
const RESULT = "all tests passed";
const COMMANDS = [{ command: COMMAND, result: RESULT }];
const MISSING = [{ command: "cd /missing", result: "no such page" }];
const LONG_WAIT_MS = 10_000;

const renderShown = (onScreen: boolean) => {
    const view = render(<Terminal commands={COMMANDS} />);

    act(() => {
        intersectAll(onScreen);
    });
    act(() => {
        jest.advanceTimersByTime(LONG_WAIT_MS);
    });

    return view;
};

describe("Terminal", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        motionStore.set(false);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should start typing once it is on screen", () => {
        const { container } = render(<Terminal commands={COMMANDS} />);

        act(() => {
            intersectAll(true);
        });
        act(() => {
            jest.advanceTimersByTime(0);
        });

        expect(container).not.toHaveTextContent(COMMAND);
    });

    it("should rest on the first command with its result off screen", () => {
        const { container } = renderShown(false);

        expect(container).toHaveTextContent(COMMAND);
        expect(container).toHaveTextContent(RESULT);
    });

    it("should rest on the first command with its result while paused", () => {
        motionStore.set(true);

        const { container } = renderShown(true);

        expect(container).toHaveTextContent(COMMAND);
        expect(container).toHaveTextContent(RESULT);
    });

    it("should keep a still block on its command and result", () => {
        const { container } = render(
            <Terminal commands={MISSING} tone="bad" animated={false} />,
        );

        act(() => {
            intersectAll(true);
        });
        act(() => {
            jest.advanceTimersByTime(LONG_WAIT_MS);
        });

        expect(container).toHaveTextContent("cd /missing");
        expect(container).toHaveTextContent("no such page");
    });

    it("should render nothing without commands", () => {
        const { container } = render(<Terminal commands={[]} />);

        expect(container).toBeEmptyDOMElement();
    });
});
