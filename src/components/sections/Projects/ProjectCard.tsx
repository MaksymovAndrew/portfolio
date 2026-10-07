import Image from "next/image";

import { IMAGE_SIZES } from "constants/images";
import type { Content } from "types/content";

import { Placeholder } from "components/decor/Placeholder";
import { BulletList } from "components/ui/BulletList";
import { Chip } from "components/ui/Chip";
import { RichText } from "components/ui/RichText";
import { TagList } from "components/ui/TagList";
import { TextLink } from "components/ui/TextLink";
import type { ViewerItem, ViewerLabels } from "components/ui/Viewer";
import { ViewerRoot, ViewerTrigger } from "components/ui/Viewer";

import { format } from "utils/inline";
import { placeholderLabel } from "utils/placeholderLabel";

import styles from "./ProjectCard.module.scss";

type Project = Content["projects"]["items"][number];

export interface ProjectCardProps {
    project: Project;
    ui: Content["ui"];
    viewerLabels: ViewerLabels;
}

const toViewerItems = (project: Project): readonly ViewerItem[] =>
    project.screenshots.map((shot) => ({
        kind: "screenshot",
        name: shot.name,
        title: shot.caption,
        meta: project.title,
        image: shot.image,
        verifyHref: null,
    }));

// data-tilt and the glare layer are there for the pointer effects; a thumbnail's name comes from its button
export const ProjectCard = ({
    project,
    ui,
    viewerLabels,
}: ProjectCardProps) => (
    <article className={styles["project-card"]} data-tilt="">
        <div className={styles["project-card__glare"]} aria-hidden="true" />
        <div className={styles["project-card__top"]}>
            <h3 className={styles["project-card__title"]}>{project.title}</h3>
            <Chip variant="live">{project.status}</Chip>
        </div>
        <p className={styles["project-card__description"]}>
            {project.description}
        </p>
        {project.screenshots.length === 0 ? null : (
            <ViewerRoot items={toViewerItems(project)} labels={viewerLabels}>
                <ul className={styles["project-card__shots"]}>
                    {project.screenshots.map((shot, index) => (
                        <li key={shot.name}>
                            <ViewerTrigger
                                index={index}
                                label={format(ui.viewer.openScreenshot, {
                                    index: String(index + 1),
                                })}
                                className={styles["project-card__shot"]}
                            >
                                {shot.image ? (
                                    <Image
                                        className={
                                            styles["project-card__picture"]
                                        }
                                        src={shot.image.src}
                                        width={shot.image.width}
                                        height={shot.image.height}
                                        alt=""
                                        sizes={IMAGE_SIZES.thumbnail}
                                    />
                                ) : (
                                    <Placeholder
                                        label={placeholderLabel(shot.name)}
                                    />
                                )}
                            </ViewerTrigger>
                        </li>
                    ))}
                </ul>
            </ViewerRoot>
        )}
        <p className={styles["project-card__story"]}>
            <RichText
                text={project.story}
                refs={project.refs}
                externalHint={ui.external}
            />
        </p>
        <BulletList
            className={styles["project-card__bullets"]}
            items={project.bullets}
            refs={project.refs}
            externalHint={ui.external}
        />
        <TagList className={styles["project-card__tags"]} tags={project.tags} />
        {project.links.length === 0 ? null : (
            <div className={styles["project-card__links"]}>
                {project.links.map((link) => (
                    <TextLink
                        key={link.href}
                        href={link.href}
                        externalHint={ui.external}
                    >
                        {link.label}
                    </TextLink>
                ))}
            </div>
        )}
    </article>
);
