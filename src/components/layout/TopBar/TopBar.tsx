import type { Content } from "types/content";

import { LocaleSwitcher } from "components/controls/LocaleSwitcher";
import { ThemeToggle } from "components/controls/ThemeToggle";
import { localeLinks, localePath } from "i18n/paths";

import styles from "./TopBar.module.scss";

export interface TopBarProps {
    content: Content;
}

export const TopBar = ({ content }: TopBarProps) => {
    const { locale, profile, ui } = content;

    return (
        <header className={styles["top-bar"]} aria-label={ui.topBar}>
            <a href={localePath(locale)} className={styles["top-bar__logo"]}>
                {profile.initials}
                <span className={styles["top-bar__name"]}>
                    {` ${profile.name}`}
                </span>
            </a>
            <div className={styles["top-bar__controls"]}>
                <LocaleSwitcher
                    links={localeLinks(locale)}
                    label={ui.languages}
                />
                <span
                    className={styles["top-bar__separator"]}
                    aria-hidden="true"
                />
                <ThemeToggle label={ui.theme} />
            </div>
        </header>
    );
};
