import type { ReactNode } from "react";

import type { SectionId } from "types/content";

import { SectionLabel } from "components/ui/SectionLabel";

import styles from "./Section.module.scss";

export interface SectionProps {
    id: SectionId;
    label: string | null;
    children: ReactNode;
}

export const Section = ({ id, label, children }: SectionProps) => (
    <section id={id} className={styles.section}>
        {label === null ? null : <SectionLabel>{label}</SectionLabel>}
        {children}
    </section>
);
