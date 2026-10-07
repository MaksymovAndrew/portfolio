import Image from "next/image";

import { GLYPHS } from "constants/glyphs";
import { IMAGE_SIZES } from "constants/images";
import type { Content } from "types/content";

import { Placeholder } from "components/decor/Placeholder";
import { Section } from "components/sections/Section";
import { TextLink } from "components/ui/TextLink";
import type { ViewerItem } from "components/ui/Viewer";
import {
    toViewerLabels,
    ViewerRoot,
    ViewerTrigger,
} from "components/ui/Viewer";

import { formatMonth } from "utils/formatPeriod";
import { format } from "utils/inline";
import { placeholderLabel } from "utils/placeholderLabel";

import styles from "./Certifications.module.scss";

export interface CertificationsProps {
    content: Content;
}

// the known parts in order, "Example Academy · May 2024"; an unknown one leaves no separator behind
const joinKnown = (parts: readonly (string | null)[]): string =>
    parts.filter((part) => part !== null).join(` ${GLYPHS.separator} `);

export const Certifications = ({ content }: CertificationsProps) => {
    const { certifications, locale, ui } = content;
    const { items, credentialLabel, verifyLabel } = certifications;

    const metaOf = ({ issuer, date }: (typeof items)[number]) =>
        joinKnown([issuer, date === null ? null : formatMonth(date, locale)]);

    const viewerItems: readonly ViewerItem[] = items.map((item) => ({
        kind: "certificate",
        name: item.name,
        title: item.title,
        meta: joinKnown([
            metaOf(item),
            item.credentialId === null
                ? null
                : format(credentialLabel, { id: item.credentialId }),
        ]),
        image: item.image,
        verifyHref: item.verifyHref,
    }));

    // the title leads the markup for readers who jump by headings; the grid still draws the thumbnail first
    return (
        <Section id="certifications" label={certifications.label}>
            {items.length === 0 ? null : (
                <ViewerRoot
                    items={viewerItems}
                    labels={toViewerLabels(content)}
                >
                    <ul className={styles.certifications}>
                        {items.map((item, index) => (
                            <li
                                key={item.name}
                                className={styles.certifications__item}
                            >
                                <div className={styles.certifications__text}>
                                    <h3
                                        className={styles.certifications__title}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className={styles.certifications__meta}>
                                        {metaOf(item)}
                                    </p>
                                </div>
                                <ViewerTrigger
                                    index={index}
                                    label={format(ui.viewer.openCertificate, {
                                        title: item.title,
                                    })}
                                    className={styles.certifications__thumb}
                                >
                                    {item.image ? (
                                        <Image
                                            className={
                                                styles.certifications__picture
                                            }
                                            src={item.image.src}
                                            width={item.image.width}
                                            height={item.image.height}
                                            alt=""
                                            sizes={IMAGE_SIZES.certificate}
                                        />
                                    ) : (
                                        <Placeholder
                                            label={placeholderLabel(item.name)}
                                        />
                                    )}
                                </ViewerTrigger>
                                {item.verifyHref === null ? null : (
                                    <TextLink
                                        href={item.verifyHref}
                                        externalHint={ui.external}
                                        small
                                        className={styles.certifications__link}
                                    >
                                        {verifyLabel}
                                    </TextLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </ViewerRoot>
            )}
        </Section>
    );
};
