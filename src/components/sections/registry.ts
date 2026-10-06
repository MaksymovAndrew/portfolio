import type { ReactNode } from "react";

import type { Content, SectionId } from "types/content";

export type SectionComponent = (props: { content: Content }) => ReactNode;

export type SectionRegistry = Partial<Record<SectionId, SectionComponent>>;

// the component of each section; content/site.ts decides which of them appear and in what order
export const SECTIONS: SectionRegistry = {};

export const pickSections = (
    ids: readonly SectionId[],
    registry: SectionRegistry,
): readonly { id: SectionId; Component: SectionComponent }[] =>
    ids.flatMap((id) => {
        const Component = registry[id];

        return Component ? [{ id, Component }] : [];
    });
