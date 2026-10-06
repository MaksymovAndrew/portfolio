import type { ReactNode } from "react";

import type { Content } from "types/content";

import { Atmosphere } from "components/decor/Atmosphere";
import { Footer } from "components/layout/Footer";
import { Sidebar } from "components/layout/Sidebar";
import { SkipLink } from "components/layout/SkipLink";
import { TopBar } from "components/layout/TopBar";

import styles from "./Shell.module.scss";

export interface ShellProps {
    content: Content;
    children: ReactNode;
}

const MAIN_ID = "main";

export const Shell = ({ content, children }: ShellProps) => (
    <>
        <SkipLink targetId={MAIN_ID} label={content.ui.skipToContent} />
        <Atmosphere />
        <div className={styles.shell}>
            <div className={styles.shell__layout}>
                <Sidebar content={content} />
                <div className={styles.shell__column}>
                    <TopBar content={content} />
                    {/* out of the Tab order, yet the skip link's jump can still move focus here */}
                    <main id={MAIN_ID} tabIndex={-1}>
                        {children}
                    </main>
                    <Footer content={content} />
                </div>
            </div>
        </div>
    </>
);
