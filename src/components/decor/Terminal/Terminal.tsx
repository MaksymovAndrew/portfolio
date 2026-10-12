"use client";

import { GLYPHS } from "constants/glyphs";
import type { Content } from "types/content";

import { useInView } from "hooks/useInView";
import { useMotionPaused } from "hooks/useMotionPaused";
import { useTypewriter } from "hooks/useTypewriter";

import styles from "./Terminal.module.scss";

export interface TerminalProps {
    commands: Content["terminal"]["commands"];
    tone?: "ok" | "bad";
    animated?: boolean;
}

// decoration, so hidden from assistive technology; still - paused, off screen or not animated - it shows the first command with its result
export const Terminal = ({
    commands,
    tone = "ok",
    animated = true,
}: TerminalProps) => {
    const paused = useMotionPaused();
    const [element, inView] = useInView();
    const still = paused || !animated || !inView;
    const { typed, output } = useTypewriter(commands, still);

    if (commands.length === 0) {
        return null;
    }

    return (
        <div
            ref={element}
            className={[styles.terminal, styles[`terminal--${tone}`]].join(" ")}
            aria-hidden="true"
        >
            <div className={styles.terminal__line}>
                <span
                    className={styles.terminal__prompt}
                >{`${GLYPHS.prompt} `}</span>
                <span
                    className={styles.terminal__home}
                >{`${GLYPHS.home} `}</span>
                {typed}
                {animated ? <span className={styles.terminal__caret} /> : null}
            </div>
            <div
                className={[
                    styles.terminal__line,
                    styles.terminal__output,
                ].join(" ")}
            >
                {output}
            </div>
        </div>
    );
};
