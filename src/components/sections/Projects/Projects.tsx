import type { Content } from "types/content";

import { Section } from "components/sections/Section";
import { toViewerLabels } from "components/ui/Viewer";

import { ProjectCard } from "./ProjectCard";

export interface ProjectsProps {
    content: Content;
}

export const Projects = ({ content }: ProjectsProps) => {
    const { projects, ui } = content;
    const viewerLabels = toViewerLabels(content);

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
