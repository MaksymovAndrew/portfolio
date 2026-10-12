import {
    HOLD_MS,
    OUTPUT_DELAY_MS,
    TYPE_DELAY_MAX_MS,
    TYPE_DELAY_MIN_MS,
} from "constants/timing";
import type { Content } from "types/content";

// what the terminal shows, and how long it stays before the next frame
export interface TypewriterFrame {
    typed: string;
    output: string | null;
    delay: number;
}

// random is Math.random in the page and a fixed value in tests; never start it without commands, it would spin
export function* typewriterFrames(
    commands: Content["terminal"]["commands"],
    random: () => number,
): Generator<TypewriterFrame, never> {
    const typeDelay = () =>
        TYPE_DELAY_MIN_MS + random() * (TYPE_DELAY_MAX_MS - TYPE_DELAY_MIN_MS);

    for (;;) {
        for (const { command, result } of commands) {
            for (let length = 0; length < command.length; length += 1) {
                yield {
                    typed: command.slice(0, length),
                    output: null,
                    delay: typeDelay(),
                };
            }

            yield { typed: command, output: null, delay: OUTPUT_DELAY_MS };
            yield { typed: command, output: result, delay: HOLD_MS };
        }
    }
}
