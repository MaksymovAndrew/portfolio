import type { Content, SectionId } from "types/content";

export interface NavItem {
    id: SectionId;
    label: string;
}

// the sections of the page in their configured order; a section without a navigation label stays out
export const buildNavItems = (content: Content): readonly NavItem[] =>
    content.site.sections.flatMap((id) => {
        const label = content[id].nav;

        return label === null ? [] : [{ id, label }];
    });
