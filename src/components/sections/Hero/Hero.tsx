import type { Content } from "types/content";

import { Identity } from "components/layout/Identity";
import { ButtonLink } from "components/ui/Button";
import { Chip } from "components/ui/Chip";

import styles from "./Hero.module.scss";

export interface HeroProps {
    content: Content;
}

export const Hero = ({ content }: HeroProps) => {
    const { hero, profile, ui } = content;

    return (
        <header className={styles.hero}>
            <Identity
                place="hero"
                eyebrow={hero.eyebrow}
                name={profile.name}
                tagline={hero.tagline}
                externalHint={ui.external}
            />
            <p className={styles.hero__sub}>{hero.sub}</p>
            <ul className={styles.hero__chips}>
                {hero.chips.map((chip) => (
                    <li key={chip}>
                        <Chip>{chip}</Chip>
                    </li>
                ))}
            </ul>
            <div className={styles.hero__actions}>
                {hero.actions.map((action) => (
                    <ButtonLink
                        key={action.target}
                        href={`#${action.target}`}
                        variant={action.variant}
                        magnetic
                    >
                        {action.label}
                    </ButtonLink>
                ))}
            </div>
        </header>
    );
};
