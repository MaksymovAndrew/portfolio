import { Fragment, type ReactNode } from "react";

import type { Refs } from "types/content";

import type { InlineNode } from "utils/inline";
import { parseInline } from "utils/inline";

import styles from "./RichText.module.scss";

export interface RichTextProps {
    text: string;
    refs?: Refs;
    externalHint: string;
}

const renderNode = (node: InlineNode, externalHint: string): ReactNode => {
    if (node.type === "text") {
        return node.value;
    }

    if (node.type === "strong") {
        return (
            <strong className={styles["rich-text__strong"]}>
                {node.value}
            </strong>
        );
    }

    if (node.type === "accent") {
        return <em>{node.value}</em>;
    }

    return node.external ? (
        <a
            href={node.href}
            target="_blank"
            rel="noreferrer"
            className={styles["rich-text__link"]}
        >
            {node.value}
            <span className={styles["rich-text__hint"]}>
                {` ${externalHint}`}
            </span>
        </a>
    ) : (
        <a href={node.href} className={styles["rich-text__link"]}>
            {node.value}
        </a>
    );
};

export const RichText = ({ text, refs, externalHint }: RichTextProps) =>
    parseInline(text, refs).map((node, index) => (
        // the nodes never move: their order is the order of the text
        <Fragment key={index}>{renderNode(node, externalHint)}</Fragment>
    ));
