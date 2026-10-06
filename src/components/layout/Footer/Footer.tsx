import { APP_VERSION } from "config/app";
import { GLYPHS } from "constants/glyphs";
import type { Content } from "types/content";

import { format } from "utils/inline";

import styles from "./Footer.module.scss";

export interface FooterProps {
    content: Content;
}

const VERSION = `v${APP_VERSION}`;

export const Footer = ({ content }: FooterProps) => {
    const { profile, site } = content;

    return (
        <footer className={styles.footer}>
            <div className={styles.footer__row}>
                <span>{format(site.footerCredit, { name: profile.name })}</span>
                <span className={styles.footer__meta}>
                    <span>
                        {[VERSION, ...site.footerStack].join(
                            ` ${GLYPHS.separator} `,
                        )}
                    </span>
                </span>
            </div>
        </footer>
    );
};
