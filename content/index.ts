import type { ContentSource } from "types/content";

import { about } from "./about";
import { achievements } from "./achievements";
import { certifications } from "./certifications";
import { contact } from "./contact";
import { education } from "./education";
import { experience } from "./experience";
import { hero } from "./hero";
import { profile } from "./profile";
import { projects } from "./projects";
import { seo } from "./seo";
import { site } from "./site";
import { skills } from "./skills";
import { terminal } from "./terminal";
import { ui } from "./ui";

// everything the site says; each file checks its own shape with `satisfies`
export const source = {
    site,
    profile,
    hero,
    skills,
    about,
    experience,
    achievements,
    projects,
    certifications,
    education,
    contact,
    terminal,
    seo,
    ui,
} satisfies ContentSource;
