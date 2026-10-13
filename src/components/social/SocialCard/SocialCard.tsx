import { GLYPHS } from "constants/glyphs";
import type { Palette, Tints } from "types/theme";

import { parseInline } from "utils/inline";
import { wordBoxes } from "utils/wordBoxes";

import { cardStyles } from "./SocialCard.styles";

export interface SocialCardProps {
    eyebrow: string;
    name: string;
    tagline: string;
    chips: readonly string[];
    initials: string;
    palette: Palette;
    tints: Tints;
    glow: readonly [string, string];
}

const WORD = /\S+/g;

// rendered to an image: inline styles and flexbox only
export const SocialCard = ({
    eyebrow,
    name,
    tagline,
    chips,
    initials,
    palette,
    tints,
    glow,
}: SocialCardProps) => {
    const styles = cardStyles(palette, tints, glow);

    return (
        <div style={styles.card}>
            <div style={styles.eyebrow}>{`${GLYPHS.comment} ${eyebrow}`}</div>
            {/* every part of the name on its own line, as on the site */}
            <div style={styles.name}>
                {name.match(WORD)?.map((part, index) => (
                    <span key={index}>{part}</span>
                ))}
            </div>
            <div style={styles.tagline}>
                {wordBoxes(parseInline(tagline)).map((box, index) => (
                    // the words never move: their order is the order of the text
                    <div key={index} style={styles.word}>
                        {box.map(({ text, accent }, piece) => (
                            <span
                                key={piece}
                                style={accent ? styles.accent : undefined}
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
            <div style={styles.foot}>
                <div style={styles.chips}>
                    {chips.map((chip, index) => (
                        // the chips never move either; two may read the same
                        <div key={index} style={styles.chip}>
                            <div style={styles.dot} />
                            {chip}
                        </div>
                    ))}
                </div>
                <div style={styles.logo}>
                    {initials}
                    <span style={styles.accent}>.</span>
                </div>
            </div>
        </div>
    );
};
