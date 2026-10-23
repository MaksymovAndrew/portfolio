import {
    OUTPUT_DELAY_MS,
    RESULT_HOLD_MS,
    TYPE_DELAY_MAX_MS,
    TYPE_DELAY_MIN_MS,
} from "constants/timing";

import type { TypewriterFrame } from "utils/typewriter";
import { typewriterFrames } from "utils/typewriter";

const COMMANDS = [
    { command: "ls", result: "two files" },
    { command: "pwd", result: "/home" },
];

const take = (count: number, random: () => number = () => 0) => {
    const frames = typewriterFrames(COMMANDS, random);

    return Array.from(
        { length: count },
        (): TypewriterFrame => frames.next().value,
    );
};

// an empty line, a frame per character, then the result
const FRAMES_PER_COMMAND = (command: string) => command.length + 2;

describe("typewriterFrames", () => {
    it("should type the command one character at a time", () => {
        const typed = take(3).map((frame) => frame.typed);

        expect(typed).toEqual(["", "l", "ls"]);
    });

    it("should keep every delay inside the bounds", () => {
        const lowest = take(2, () => 0).map((frame) => frame.delay);
        const highest = take(2, () => 0.999_999).map((frame) => frame.delay);

        expect(lowest).toEqual([TYPE_DELAY_MIN_MS, TYPE_DELAY_MIN_MS]);
        highest.forEach((delay) => {
            expect(delay).toBeGreaterThanOrEqual(TYPE_DELAY_MIN_MS);
            expect(delay).toBeLessThan(TYPE_DELAY_MAX_MS);
        });
    });

    it("should show the result after the output delay", () => {
        const [, , typed, shown] = take(4);

        expect(typed).toEqual({
            typed: "ls",
            output: null,
            delay: OUTPUT_DELAY_MS,
        });
        expect(shown).toEqual({
            typed: "ls",
            output: "two files",
            delay: RESULT_HOLD_MS,
        });
    });

    it("should hold, then start the next command", () => {
        const next = take(FRAMES_PER_COMMAND("ls") + 2).slice(-2);

        expect(next.map((frame) => frame.typed)).toEqual(["", "p"]);
        expect(next.map((frame) => frame.output)).toEqual([null, null]);
    });

    it("should return to the first command after the last", () => {
        const cycle = FRAMES_PER_COMMAND("ls") + FRAMES_PER_COMMAND("pwd");
        const again = take(cycle + 2).slice(-2);

        expect(again.map((frame) => frame.typed)).toEqual(["", "l"]);
    });
});
