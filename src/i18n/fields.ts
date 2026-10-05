import type { ContentSource, Localized, Period, Refs } from "types/content";

// where the content keeps the values that need more than a type check
export interface Found<T> {
    path: string;
    value: T;
}

export interface RichField extends Found<Localized> {
    refs: Refs;
}

const NO_REFS: Refs = {};

const at = <T>(path: string, value: T): Found<T> => ({ path, value });

const optional = <T>(path: string, value: T | null): Found<T>[] =>
    value === null ? [] : [at(path, value)];

// the only fields where markup is allowed, each with the refs its links may use
export const richFields = (source: ContentSource): RichField[] => {
    const { hero, about, experience, achievements, projects } = source;

    return [
        { ...at("hero.tagline", hero.tagline), refs: NO_REFS },
        ...about.paragraphs.map((text, index) => ({
            ...at(`about.paragraphs[${index}]`, text),
            refs: about.refs,
        })),
        ...experience.entries.flatMap((entry, entryIndex) =>
            entry.bullets.map((text, index) => ({
                ...at(
                    `experience.entries[${entryIndex}].bullets[${index}]`,
                    text,
                ),
                refs: NO_REFS,
            })),
        ),
        ...achievements.items.map((text, index) => ({
            ...at(`achievements.items[${index}]`, text),
            refs: NO_REFS,
        })),
        ...projects.items.flatMap((item, itemIndex) =>
            [
                at(`projects.items[${itemIndex}].story`, item.story),
                ...item.bullets.map((text, index) =>
                    at(`projects.items[${itemIndex}].bullets[${index}]`, text),
                ),
            ].map((found) => ({ ...found, refs: item.refs })),
        ),
    ];
};

export const refsFields = ({
    about,
    projects,
}: ContentSource): Found<Refs>[] => [
    at("about.refs", about.refs),
    ...projects.items.map((item, index) =>
        at(`projects.items[${index}].refs`, item.refs),
    ),
];

export const linkFields = (source: ContentSource): Found<string>[] => [
    ...source.profile.links.map((link, index) =>
        at(`profile.links[${index}].href`, link.href),
    ),
    ...source.projects.items.flatMap((item, itemIndex) =>
        item.links.map((link, index) =>
            at(`projects.items[${itemIndex}].links[${index}].href`, link.href),
        ),
    ),
    ...source.certifications.items.flatMap((item, index) =>
        optional(`certifications.items[${index}].verifyHref`, item.verifyHref),
    ),
    ...refsFields(source).flatMap(({ path, value }) =>
        Object.entries(value).map(([key, href]) => at(`${path}.${key}`, href)),
    ),
];

// paths the site serves from public/
export const fileFields = (source: ContentSource): Found<string>[] => {
    const { profile, projects, certifications } = source;

    return [
        ...optional("profile.cv.href", profile.cv?.href ?? null),
        ...projects.items.flatMap((item, itemIndex) =>
            item.screenshots.flatMap((shot, index) =>
                optional(
                    `projects.items[${itemIndex}].screenshots[${index}].image.src`,
                    shot.image?.src ?? null,
                ),
            ),
        ),
        ...certifications.items.flatMap((item, index) =>
            optional(
                `certifications.items[${index}].image.src`,
                item.image?.src ?? null,
            ),
        ),
    ];
};

export const periodFields = ({
    experience,
    education,
}: ContentSource): Found<Period>[] => [
    ...experience.entries.map((entry, index) =>
        at(`experience.entries[${index}].period`, entry.period),
    ),
    ...education.entries.map((entry, index) =>
        at(`education.entries[${index}].period`, entry.period),
    ),
];

export const monthFields = ({
    certifications,
}: ContentSource): Found<string | null>[] =>
    certifications.items.map((item, index) =>
        at(`certifications.items[${index}].date`, item.date),
    );
