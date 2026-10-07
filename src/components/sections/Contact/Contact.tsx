import type { Content, SectionId } from "types/content";

import { CopyButton } from "components/controls/CopyButton";
import { CvLink } from "components/controls/CvLink";
import { Section } from "components/sections/Section";

import styles from "./Contact.module.scss";

export interface ContactProps {
    content: Content;
}

const ID: SectionId = "contact";

// the copy button selects this element when the clipboard refuses
const ADDRESS_ID = `${ID}-address`;

// a line breaks before the at sign first; an address without one stays whole
const Address = ({ email }: { email: string }) => {
    const at = email.lastIndexOf("@");

    return at > 0 ? (
        <>
            {email.slice(0, at)}
            <wbr />
            {email.slice(at)}
        </>
    ) : (
        email
    );
};

// the section label is the h2, so the large line is an h3 drawn as the design's heading
export const Contact = ({ content }: ContactProps) => {
    const { contact, profile, ui } = content;

    return (
        <Section id={ID} label={contact.label}>
            <h3 className={styles.contact__heading}>{contact.heading}</h3>
            <p className={styles.contact__text}>{contact.text}</p>
            <div className={styles["contact__mail-row"]}>
                <a
                    id={ADDRESS_ID}
                    className={styles.contact__mail}
                    href={`mailto:${profile.email}`}
                >
                    <Address email={profile.email} />
                </a>
                <CopyButton
                    value={profile.email}
                    targetId={ADDRESS_ID}
                    labels={ui.copy}
                />
            </div>
            <div className={styles.contact__socials}>
                {profile.links.map((link) => (
                    <a
                        key={link.id}
                        className={styles.contact__social}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {link.label}
                        <span
                            className={styles.contact__hint}
                        >{` ${ui.external}`}</span>
                    </a>
                ))}
                <CvLink cv={profile.cv} variant="social" />
            </div>
        </Section>
    );
};
