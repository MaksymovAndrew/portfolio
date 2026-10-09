import type { Content } from "types/content";

import { CvLink } from "components/controls/CvLink";
import { LocaleSwitcher } from "components/controls/LocaleSwitcher";
import { MenuSheet } from "components/controls/MenuSheet";
import { ThemeToggle } from "components/controls/ThemeToggle";
import { localeLinks, localePath } from "i18n/paths";

import { buildNavItems } from "utils/navItems";

import styles from "./TopBar.module.scss";

export interface TopBarProps {
    content: Content;
}

export const TopBar = ({ content }: TopBarProps) => {
    const { locale, profile, ui } = content;
    const navItems = buildNavItems(content);

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
                    sections={navItems.map((item) => item.id)}
                />
                <span
                    className={styles["top-bar__separator"]}
                    aria-hidden="true"
                />
                <ThemeToggle label={ui.theme} />
                <MenuSheet
                    items={navItems}
                    labels={{
                        open: ui.menu.open,
                        title: ui.menu.title,
                        close: ui.close,
                        sections: ui.sections,
                    }}
                >
                    <CvLink cv={profile.cv} />
                </MenuSheet>
            </div>
        </header>
    );
};
