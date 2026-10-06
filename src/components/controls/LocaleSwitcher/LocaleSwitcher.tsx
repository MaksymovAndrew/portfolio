import type { LocaleLink } from "i18n/paths";

import styles from "./LocaleSwitcher.module.scss";

export interface LocaleSwitcherProps {
    links: readonly LocaleLink[];
    label: string;
}

// plain links: they work without JavaScript and each language page can be bookmarked
export const LocaleSwitcher = ({ links, label }: LocaleSwitcherProps) => {
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
                    href={link.href}
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
