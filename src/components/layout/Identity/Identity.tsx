import { RichText } from "components/ui/RichText";

import styles from "./Identity.module.scss";

export interface IdentityProps {
    eyebrow: string;
    name: string;
    tagline: string;
    externalHint: string;
    place: "sidebar" | "hero";
}

// the page carries it twice, in the left column and in the hero; CSS displays one, so one h1 is ever shown
export const Identity = ({
    eyebrow,
    name,
    tagline,
    externalHint,
    place,
}: IdentityProps) => (
    <div className={styles[`identity--${place}`]}>
        <p className={styles.identity__eyebrow}>{eyebrow}</p>
        <h1 className={styles.identity__name}>{name}</h1>
        <p className={styles.identity__tagline}>
            <RichText text={tagline} externalHint={externalHint} />
        </p>
    </div>
);
