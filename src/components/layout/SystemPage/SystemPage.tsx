import type { ReactNode, Ref } from "react";

import { GLYPHS } from "constants/glyphs";

import { Atmosphere } from "components/decor/Atmosphere";
import { ArrowRight } from "components/icons/ArrowRight";
import { Close } from "components/icons/Close";

import styles from "./SystemPage.module.scss";

export interface SystemPageProps {
    topBar: ReactNode;
    label: string;
    heading: string;
    text: string;
    command: string;
    result: string;
    // the action buttons
    children: ReactNode;
    // a page that replaces the one being read moves focus to its heading
    headingRef?: Ref<HTMLHeadingElement>;
}

// the 404 and error pages: the top bar at every width and one message, no left column
export const SystemPage = ({
    topBar,
    label,
    heading,
    text,
    command,
    result,
    children,
    headingRef,
}: SystemPageProps) => (
    <>
        <Atmosphere />
        <div className={styles["system-page"]}>
            {topBar}
            <main className={styles["system-page__main"]}>
                <p className={styles["system-page__label"]}>{label}</p>
                <h1
                    ref={headingRef}
                    tabIndex={headingRef ? -1 : undefined}
                    className={styles["system-page__heading"]}
                >
                    {heading}
                </h1>
                <p className={styles["system-page__text"]}>{text}</p>
                <div
                    className={styles["system-page__terminal"]}
                    aria-hidden="true"
                >
                    <div>
                        <span className={styles["system-page__prompt"]}>
                            <ArrowRight
                                className={styles["system-page__mark"]}
                            />{" "}
                        </span>
                        <span
                            className={styles["system-page__home"]}
                        >{`${GLYPHS.home} `}</span>
                        {command}
                    </div>
                    <div>
                        <Close className={styles["system-page__mark"]} />{" "}
                        {result}
                    </div>
                </div>
                <div className={styles["system-page__actions"]}>{children}</div>
            </main>
        </div>
    </>
);
