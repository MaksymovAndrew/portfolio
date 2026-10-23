import type { Content } from "types/content";

import { CvLink } from "components/controls/CvLink";
import { LocaleSwitcher } from "components/controls/LocaleSwitcher";
import { MenuSheet } from "components/controls/MenuSheet";
import { ThemeToggle } from "components/controls/ThemeToggle";
import { StatusLine } from "components/decor/StatusLine";
import { localeLinks, localePath } from "i18n/paths";

import { cx } from "utils/cx";
import { buildNavItems } from "utils/navItems";

import styles from "./TopBar.module.scss";

export interface TopBarProps {
    content: Content;
    // the 404 and error pages: no sections to list, so no menu, and the bar at every width
    variant?: "page" | "system";
}

export const TopBar = ({ content, variant = "page" }: TopBarProps) => {
    const { locale, profile, ui } = content;
    const navItems = variant === "page" ? buildNavItems(content) : [];

    return (
        <header
            className={cx(
                styles["top-bar"],
                variant === "system" ? styles["top-bar--system"] : null,
            )}
            aria-label={ui.topBar}
        >
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
                {variant === "page" && (
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
                        <StatusLine
                            availability={profile.availability}
                            city={profile.city}
                            timeZone={profile.timeZone}
                        />
                    </MenuSheet>
                )}
            </div>
        </header>
    );
};
