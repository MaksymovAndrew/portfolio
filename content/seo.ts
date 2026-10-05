import type { SeoSource } from "types/content";

import { hero } from "./hero";

// the role stays in English on every language, as in the eyebrow
const TITLE = "Andrii Maksymov - Frontend Developer";

export const seo = {
    title: { en: TITLE, pl: TITLE, uk: TITLE },
    description: hero.sub,
    // the text alternative of the link preview image
    cardAlt: {
        en: "Andrii Maksymov - Frontend Developer, React & TypeScript",
        pl: "Andrii Maksymov - Frontend Developer, React i TypeScript",
        uk: "Andrii Maksymov - Frontend Developer, React і TypeScript",
    },
} satisfies SeoSource;
