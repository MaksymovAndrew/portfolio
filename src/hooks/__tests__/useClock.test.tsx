import { act, render, screen } from "@testing-library/react";

import { CLOCK_TICK_MS } from "constants/timing";

import { useClock } from "hooks/useClock";

// noon in winter: one hour ahead in Berlin, two in Kyiv
const NOON_UTC = new Date("2026-01-15T12:00:00Z");

const Harness = ({ timeZone }: { timeZone: string }) => (
    <span data-testid="clock">{useClock(timeZone)}</span>
);

const clock = () => screen.getByTestId("clock").textContent;

describe("useClock", () => {
    beforeEach(() => {
        jest.useFakeTimers({ now: NOON_UTC });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should show the time of the given zone", () => {
        render(<Harness timeZone="Europe/Berlin" />);

        expect(clock()).toBe("13:00");
    });

    it("should follow a change of the zone", () => {
        const { rerender } = render(<Harness timeZone="Europe/Berlin" />);

        rerender(<Harness timeZone="Europe/Kyiv" />);

        expect(clock()).toBe("14:00");
    });

    it("should tick every thirty seconds", () => {
        render(<Harness timeZone="UTC" />);

        act(() => {
            jest.advanceTimersByTime(CLOCK_TICK_MS * 2 - 1);
        });

        expect(clock()).toBe("12:00");

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(clock()).toBe("12:01");
    });
});
