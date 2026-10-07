import { SECTION_IDS } from "constants/sections";
import type { Content, ContentSource, Localized } from "types/content";

import { foldContent } from "i18n/fold";
import { DEFAULT_LOCALE, LOCALES } from "i18n/locales";

// the same words in every language, so no test depends on the configured languages
const text = (value: string): Localized =>
    Object.fromEntries(LOCALES.map((locale) => [locale, value])) as Localized;

const systemPage = (label: string, heading: string, result: string) => ({
    label: text(label),
    heading: text(heading),
    text: text(`${heading} Text.`),
    command: "cd /missing",
    result: text(result),
});

// a fictional person with markup in every rich field and both forms of every optional part
export const contentSource: ContentSource = {
    site: {
        sections: SECTION_IDS,
        footerStack: ["Next.js", "TypeScript"],
        footerCredit: text("Designed & built by {name}"),
    },
    profile: {
        name: "Jane Example",
        initials: "JE",
        city: "Exampleville",
        timeZone: "Europe/Berlin",
        availability: text("open to work"),
        email: "jane@example.com",
        links: [
            { id: "github", label: "GitHub", href: "https://example.com/gh" },
            {
                id: "telegram",
                label: "Telegram",
                href: "https://example.com/tg",
            },
        ],
        cv: { href: "/cv.pdf", label: "CV" },
        languages: [
            { code: "en", name: text("English"), level: text("C2") },
            { code: "de", name: text("German"), level: text("B2") },
        ],
    },
    hero: {
        eyebrow: text("Frontend Developer"),
        tagline: text("I build *fast* interfaces."),
        sub: text("Five years of shipping web apps."),
        chips: ["tests passing", "types strict"],
        actions: [
            {
                label: text("View my work"),
                target: "projects",
                variant: "primary",
            },
            {
                label: text("Get in touch"),
                target: "contact",
                variant: "ghost",
            },
        ],
    },
    skills: {
        label: null,
        nav: null,
        rows: [
            ["React", "TypeScript"],
            ["Jest", "Docker"],
        ],
    },
    about: {
        label: text("about"),
        nav: text("About"),
        paragraphs: [
            text("Hi, I am **Jane**."),
            text("I learned with [Sam](@sam)."),
        ],
        refs: { sam: "https://example.com/sam" },
    },
    experience: {
        label: text("experience"),
        nav: text("Experience"),
        entries: [
            {
                role: "Frontend Engineer",
                organisation: "Example Corp",
                meta: text("Remote"),
                period: { start: "2021-03", end: null },
                text: text("Built the storefront."),
                bullets: [
                    text("Shipped **checkout**"),
                    text("Wrote *many* tests"),
                ],
                tags: ["React", "Jest"],
            },
        ],
    },
    achievements: {
        label: text("shipped"),
        nav: text("Shipped"),
        fileName: "achievements.diff",
        items: [text("Cut the load time by **half**")],
    },
    projects: {
        label: text("featured project"),
        nav: text("Project"),
        items: [
            {
                title: "Example App",
                status: "live",
                description: text("A demo application."),
                screenshots: [
                    {
                        name: "example-app / home",
                        image: {
                            src: "/images/example-home.webp",
                            width: 1600,
                            height: 1000,
                            alt: text("The home screen"),
                        },
                        caption: text("Home"),
                    },
                    {
                        name: "example-app / settings",
                        image: null,
                        caption: text("Settings"),
                    },
                ],
                story: text("Built together with [Sam](@sam)."),
                refs: { sam: "https://example.com/sam" },
                bullets: [text("**100+ tests**")],
                tags: ["Next.js"],
                links: [
                    {
                        label: text("Production"),
                        href: "https://example.com/app",
                    },
                    {
                        label: text("Source"),
                        href: "https://example.com/app-source",
                    },
                ],
            },
        ],
    },
    certifications: {
        label: text("certifications"),
        nav: text("Certificates"),
        verifyLabel: text("Verify"),
        credentialLabel: text("ID {id}"),
        items: [
            {
                title: "Example Certificate",
                issuer: "Example Academy",
                date: "2024-05",
                credentialId: "EX-123",
                verifyHref: "https://example.com/verify",
                name: "certificates / example",
                image: {
                    src: "/images/example-certificate.webp",
                    width: 1414,
                    height: 1000,
                    alt: text("The example certificate"),
                },
            },
            {
                title: "Bare Certificate",
                issuer: "Example Academy",
                date: null,
                credentialId: null,
                verifyHref: null,
                name: "certificates / bare",
                image: null,
            },
        ],
    },
    education: {
        label: text("education"),
        nav: text("Education"),
        entries: [
            {
                field: text("Computer Science"),
                organisation: "Example University",
                faculty: "Faculty of Informatics",
                degree: text("Bachelor"),
                period: { start: "2017-10", end: "2021-06" },
            },
        ],
    },
    contact: {
        label: text("get in touch"),
        nav: text("Contact"),
        heading: text("Let us talk."),
        text: text("Email works best."),
    },
    terminal: {
        commands: [{ command: "npm test", result: "all tests passed" }],
    },
    seo: {
        title: text("Jane Example - Frontend Developer"),
        description: text("Five years of shipping web apps."),
        cardAlt: text("Jane Example - Frontend Developer"),
    },
    ui: {
        skipToContent: text("Skip to content"),
        languages: text("Language"),
        theme: text("Change theme"),
        sections: text("Sections"),
        topBar: text("Top bar"),
        menu: { open: text("Open menu"), title: text("menu") },
        close: text("Close"),
        backToTop: text("Back to top"),
        home: text("Back to home"),
        present: text("Present"),
        external: text("(opens in a new tab)"),
        copy: {
            label: text("Copy email"),
            done: text("copied"),
            status: text("Email copied"),
        },
        motion: {
            pause: text("pause animations"),
            resume: text("play animations"),
        },
        viewer: {
            openScreenshot: text("Open screenshot {index}"),
            openCertificate: text("Open certificate: {title}"),
            previous: text("Previous"),
            next: text("Next"),
        },
        notFound: systemPage("404", "Not here.", "no such page"),
        error: {
            ...systemPage("error", "It broke.", "failed"),
            retry: text("Try again"),
        },
    },
};

export const content: Content = {
    ...foldContent(contentSource, DEFAULT_LOCALE),
    locale: DEFAULT_LOCALE,
};
