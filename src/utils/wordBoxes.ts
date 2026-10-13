import type { InlineNode } from "utils/inline";

export interface WordPiece {
    text: string;
    accent: boolean;
}

const SPACE = /(\s+)/;
const ONLY_SPACE = /^\s+$/;

// the image renderer cannot flow text across differently coloured spans: one box per word, split only where the text has a space
export const wordBoxes = (
    nodes: readonly InlineNode[],
): readonly (readonly WordPiece[])[] => {
    const boxes: WordPiece[][] = [[]];

    nodes.forEach((node) => {
        node.value.split(SPACE).forEach((part) => {
            if (ONLY_SPACE.test(part)) {
                boxes.push([]);
            } else if (part) {
                boxes.at(-1)?.push({
                    text: part,
                    accent: node.type === "accent",
                });
            }
        });
    });

    return boxes.filter((box) => box.length > 0);
};
