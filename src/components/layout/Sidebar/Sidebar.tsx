import type { Content } from "types/content";

import { CvLink } from "components/controls/CvLink";
import { LocaleSwitcher } from "components/controls/LocaleSwitcher";
import { SectionNav } from "components/controls/SectionNav";
import { ThemeToggle } from "components/controls/ThemeToggle";
import { Identity } from "components/layout/Identity";
import { localeLinks } from "i18n/paths";

import { buildNavItems } from "utils/navItems";

import styles from "./Sidebar.module.scss";

export interface SidebarProps {
    content: Content;
}

export const Sidebar = ({ content }: SidebarProps) => {
    const { locale, hero, profile, ui } = content;
    const navItems = buildNavItems(content);

    return (
        <header className={styles.sidebar}>
            <div className={styles.sidebar__controls}>
                <div className={styles.sidebar__settings}>
                    <LocaleSwitcher
                        links={localeLinks(locale)}
                        label={ui.languages}
                        sections={navItems.map((item) => item.id)}
                    />
                    <span
                        className={styles.sidebar__separator}
                        aria-hidden="true"
                    />
                    <ThemeToggle label={ui.theme} />
                </div>
                <CvLink cv={profile.cv} />
            </div>
            <Identity
                place="sidebar"
                eyebrow={hero.eyebrow}
                name={profile.name}
                tagline={hero.tagline}
                externalHint={ui.external}
            />
            <div className={styles.sidebar__nav}>
                <SectionNav items={navItems} label={ui.sections} />
            </div>
        </header>
    );
};
