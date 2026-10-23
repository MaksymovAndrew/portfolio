import type { SeoSource } from "types/content";

import { hero } from "./hero";
import { profile } from "./profile";

// the role stays in English on every language, as in the eyebrow
const TITLE = `${profile.name} - Frontend Developer`;

export const seo = {
    title: { en: TITLE, pl: TITLE, uk: TITLE },
    description: hero.sub,
    // the text alternative of the link preview image
    cardAlt: {
        en: `${TITLE}, React & TypeScript`,
        pl: `${TITLE}, React i TypeScript`,
        uk: `${TITLE}, React і TypeScript`,
    },
} satisfies SeoSource;
