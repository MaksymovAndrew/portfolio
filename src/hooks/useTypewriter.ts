import { useEffect, useState } from "react";

import type { Content } from "types/content";

import { typewriterFrames } from "utils/typewriter";

interface Shown {
    typed: string;
    output: string | null;
}

// still - on the server, while paused, without commands - it shows the first command with its result
export const useTypewriter = (
    commands: Content["terminal"]["commands"],
    paused: boolean,
): Shown => {
    const [frame, setFrame] = useState<Shown | null>(null);
    const running = !paused && commands.length > 0;

    useEffect(() => {
        if (!running) {
            return undefined;
        }

        const frames = typewriterFrames(commands, Math.random);
        let timer: ReturnType<typeof setTimeout>;

        const show = () => {
            const { value } = frames.next();

            setFrame({ typed: value.typed, output: value.output });
            timer = setTimeout(show, value.delay);
        };

        timer = setTimeout(show, 0);

        return () => {
            clearTimeout(timer);
            setFrame(null);
        };
    }, [commands, running]);

    const [first] = commands;

    return running && frame
        ? frame
        : { typed: first?.command ?? "", output: first?.result ?? null };
};
