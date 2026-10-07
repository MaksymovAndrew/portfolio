import type { ReactNode } from "react";

import type { Content, SectionId } from "types/content";

import { About } from "components/sections/About";
import { Achievements } from "components/sections/Achievements";
import { Certifications } from "components/sections/Certifications";
import { Contact } from "components/sections/Contact";
import { Education } from "components/sections/Education";
import { Experience } from "components/sections/Experience";
import { Projects } from "components/sections/Projects";
import { Skills } from "components/sections/Skills";

export type SectionComponent = (props: { content: Content }) => ReactNode;

export type SectionRegistry = Record<SectionId, SectionComponent>;

// the component of each section; content/site.ts decides which of them appear and in what order
export const SECTIONS: SectionRegistry = {
    skills: Skills,
    about: About,
    experience: Experience,
    achievements: Achievements,
    projects: Projects,
    certifications: Certifications,
    education: Education,
    contact: Contact,
};

export const pickSections = (
    ids: readonly SectionId[],
    registry: SectionRegistry,
): readonly { id: SectionId; Component: SectionComponent }[] =>
    ids.map((id) => ({ id, Component: registry[id] }));
