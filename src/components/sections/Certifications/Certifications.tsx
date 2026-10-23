import { GLYPHS } from "constants/glyphs";
import { IMAGE_SIZES } from "constants/images";
import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { Picture } from "components/ui/Picture";
import { TextLink } from "components/ui/TextLink";
import type { ViewerItem } from "components/ui/Viewer";
import {
    toViewerLabels,
    ViewerRoot,
    ViewerTrigger,
} from "components/ui/Viewer";

import { formatMonth } from "utils/formatPeriod";
import { fillTemplate } from "utils/inline";

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
                : fillTemplate(credentialLabel, { id: item.credentialId }),
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
                                    label={fillTemplate(
                                        ui.viewer.openCertificate,
                                        {
                                            title: item.title,
                                        },
                                    )}
                                    className={styles.certifications__thumb}
                                >
                                    <Picture
                                        image={item.image}
                                        name={item.name}
                                        sizes={IMAGE_SIZES.certificate}
                                        className={
                                            styles.certifications__picture
                                        }
                                    />
                                </ViewerTrigger>
                                {item.verifyHref === null ? null : (
                                    <TextLink
                                        href={item.verifyHref}
                                        externalHint={ui.external}
                                        variant="small"
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
