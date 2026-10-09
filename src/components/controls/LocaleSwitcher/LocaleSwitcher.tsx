"use client";

import type { SectionId } from "types/content";

import { useActiveSection } from "hooks/useActiveSection";

import type { LocaleLink } from "i18n/paths";
import { localeHref } from "i18n/paths";

import styles from "./LocaleSwitcher.module.scss";

export interface LocaleSwitcherProps {
    links: readonly LocaleLink[];
    label: string;
    sections: readonly SectionId[];
}

// plain links: they work without JavaScript and each language page can be bookmarked; with it they keep the section being read
export const LocaleSwitcher = ({
    links,
    label,
    sections,
}: LocaleSwitcherProps) => {
    const section = useActiveSection(sections);

    if (links.length < 2) {
        return null;
    }

    return (
        <div
            role="group"
            aria-label={label}
            className={styles["locale-switcher"]}
        >
            {links.map((link) => (
                <a
                    key={link.locale}
                    href={localeHref(link.href, section)}
                    hrefLang={link.locale}
                    lang={link.locale}
                    aria-current={link.current ? "page" : undefined}
                    className={styles["locale-switcher__link"]}
                >
                    {link.label}
                    <span className={styles["locale-switcher__name"]}>
                        {` ${link.name}`}
                    </span>
                </a>
            ))}
        </div>
    );
};
