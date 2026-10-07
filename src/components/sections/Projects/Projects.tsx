import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import type { ViewerLabels } from "components/ui/Viewer";

import { ProjectCard } from "./ProjectCard";

export interface ProjectsProps {
    content: Content;
}

export const Projects = ({ content }: ProjectsProps) => {
    const { projects, certifications, ui } = content;
    const viewerLabels: ViewerLabels = {
        close: ui.close,
        previous: ui.viewer.previous,
        next: ui.viewer.next,
        verify: certifications.verifyLabel,
        externalHint: ui.external,
    };

    return (
        <Section id="projects" label={projects.label}>
            {projects.items.map((project) => (
                <ProjectCard
                    key={project.title}
                    project={project}
                    ui={ui}
                    viewerLabels={viewerLabels}
                />
            ))}
        </Section>
    );
};
