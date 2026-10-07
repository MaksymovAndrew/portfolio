import { act, fireEvent, render, screen } from "@testing-library/react";

import { COPY_RESET_MS } from "constants/timing";

import { useCopy } from "hooks/useCopy";

import { removeClipboard } from "test/shims/clipboard";

const ADDRESS = "jane@example.com";
const TARGET_ID = "address";

const Harness = () => {
    const { copied, copy } = useCopy(ADDRESS, TARGET_ID);

    return (
        <>
            <span id={TARGET_ID}>{ADDRESS}</span>
            <button
                type="button"
                onClick={() => {
                    void copy();
                }}
            >
                {copied ? "done" : "rest"}
            </button>
        </>
    );
};

// the copy waits for the clipboard: let its promise settle before looking
const clickCopy = async () => {
    fireEvent.click(screen.getByRole("button"));

    await act(async () => {
        await Promise.resolve();
    });
};

describe("useCopy", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should report copied and reset after the delay", async () => {
        const writeText = jest.spyOn(navigator.clipboard, "writeText");

        render(<Harness />);
        await clickCopy();

        expect(writeText.mock.calls).toEqual([[ADDRESS]]);

        act(() => {
            jest.advanceTimersByTime(COPY_RESET_MS - 1);
        });

        expect(screen.getByRole("button")).toHaveTextContent("done");

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(screen.getByRole("button")).toHaveTextContent("rest");
    });

    it("should restart the delay on a second copy", async () => {
        render(<Harness />);
        await clickCopy();

        act(() => {
            jest.advanceTimersByTime(COPY_RESET_MS - 1);
        });

        await clickCopy();

        act(() => {
            jest.advanceTimersByTime(COPY_RESET_MS - 1);
        });

        expect(screen.getByRole("button")).toHaveTextContent("done");

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(screen.getByRole("button")).toHaveTextContent("rest");
    });

    it("should select the address when the clipboard refuses", async () => {
        jest.spyOn(navigator.clipboard, "writeText").mockImplementation(() =>
            Promise.reject(new Error("permission denied")),
        );

        render(<Harness />);
        await clickCopy();

        expect(window.getSelection()?.toString()).toBe(ADDRESS);
        expect(screen.getByRole("button")).toHaveTextContent("rest");
    });

    it("should not throw without a clipboard", async () => {
        removeClipboard();

        render(<Harness />);
        await clickCopy();

        expect(window.getSelection()?.toString()).toBe(ADDRESS);
        expect(screen.getByRole("button")).toHaveTextContent("rest");
    });
});
