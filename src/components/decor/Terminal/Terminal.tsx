"use client";

import { GLYPHS } from "constants/glyphs";
import type { Content } from "types/content";

import { useInView } from "hooks/useInView";
import { useMotionPaused } from "hooks/useMotionPaused";
import { useTypewriter } from "hooks/useTypewriter";

import { ArrowRight } from "components/icons/ArrowRight";
import { Check } from "components/icons/Check";

import { cx } from "utils/cx";

import styles from "./Terminal.module.scss";

export interface TerminalProps {
    commands: Content["terminal"]["commands"];
}

// decoration, so hidden from assistive technology; paused or off screen it shows the first command with its result
export const Terminal = ({ commands }: TerminalProps) => {
    const paused = useMotionPaused();
    const [element, inView] = useInView();
    const { typed, output } = useTypewriter(commands, paused || !inView);

    if (commands.length === 0) {
        return null;
    }

    return (
        <div ref={element} className={styles.terminal} aria-hidden="true">
            <div className={styles.terminal__line}>
                <span className={styles.terminal__prompt}>
                    <ArrowRight className={styles.terminal__mark} />{" "}
                </span>
                <span
                    className={styles.terminal__home}
                >{`${GLYPHS.home} `}</span>
                {typed}
                <span className={styles.terminal__caret} />
            </div>
            <div className={cx(styles.terminal__line, styles.terminal__output)}>
                {output === null ? null : (
                    <>
                        <Check className={styles.terminal__mark} /> {output}
                    </>
                )}
            </div>
        </div>
    );
};
