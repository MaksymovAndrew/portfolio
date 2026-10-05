import type { SiteSource } from "types/content";

export const site = {
    // which sections the page shows, top to bottom
    sections: [
        "skills",
        "about",
        "experience",
        "achievements",
        "projects",
        "certifications",
        "education",
        "contact",
    ],
    footerStack: ["Next.js", "TypeScript"],
    // {name} is the name from profile.ts
    footerCredit: {
        en: "Designed & built by {name}",
        pl: "Projekt i wykonanie: {name}",
        uk: "Дизайн і розробка: {name}",
    },
} satisfies SiteSource;
