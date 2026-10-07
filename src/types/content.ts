import type { SECTION_IDS } from "constants/sections";

import type { Locale } from "i18n/locales";

export type Localized = Readonly<Record<Locale, string>>;
export type Refs = Readonly<Record<string, string>>;
export type SectionId = (typeof SECTION_IDS)[number];

// what a component receives: each Localized becomes one string; Refs passes that test too, so its index signature keeps it
export type Folded<T> = T extends Localized
    ? string extends keyof T
        ? T
        : string
    : T extends readonly (infer Item)[]
      ? readonly Folded<Item>[]
      : T extends object
        ? { readonly [Key in keyof T]: Folded<T[Key]> }
        : T;

interface SectionMeta {
    label: Localized | null;
    nav: Localized | null;
}

export interface ImageSource {
    src: string;
    width: number;
    height: number;
    alt: Localized;
}

// months as "YYYY-MM"; an end of null means "until now"
export interface Period {
    start: string;
    end: string | null;
}

export interface SiteSource {
    sections: readonly SectionId[];
    footerStack: readonly string[];
    footerCredit: Localized;
}

export interface ProfileSource {
    name: string;
    initials: string;
    city: string;
    timeZone: string;
    availability: Localized;
    email: string;
    links: readonly { id: string; label: string; href: string }[];
    cv: { href: string; label: string } | null;
    languages: readonly { code: string; name: Localized; level: Localized }[];
}

export interface HeroSource {
    eyebrow: Localized;
    tagline: Localized;
    sub: Localized;
    chips: readonly string[];
    actions: readonly {
        label: Localized;
        target: SectionId;
        variant: "primary" | "ghost";
    }[];
}

export interface SkillsSource extends SectionMeta {
    rows: readonly (readonly string[])[];
}

export interface AboutSource extends SectionMeta {
    paragraphs: readonly Localized[];
    refs: Refs;
}

export interface ExperienceSource extends SectionMeta {
    entries: readonly {
        role: string;
        organisation: string;
        meta: Localized;
        period: Period;
        text: Localized;
        bullets: readonly Localized[];
        tags: readonly string[];
    }[];
}

export interface AchievementsSource extends SectionMeta {
    fileName: string;
    items: readonly Localized[];
}

export interface ProjectsSource extends SectionMeta {
    items: readonly {
        title: string;
        status: string;
        description: Localized;
        screenshots: readonly {
            name: string;
            image: ImageSource | null;
            caption: Localized;
        }[];
        story: Localized;
        refs: Refs;
        bullets: readonly Localized[];
        tags: readonly string[];
        links: readonly { label: Localized; href: string }[];
    }[];
}

export interface CertificationsSource extends SectionMeta {
    verifyLabel: Localized;
    credentialLabel: Localized;
    items: readonly {
        title: string;
        issuer: string;
        date: string | null;
        credentialId: string | null;
        verifyHref: string | null;
        name: string;
        image: ImageSource | null;
    }[];
}

export interface EducationSource extends SectionMeta {
    entries: readonly {
        field: Localized;
        organisation: string;
        faculty: string;
        degree: Localized;
        period: Period;
    }[];
}

export interface ContactSource extends SectionMeta {
    heading: Localized;
    text: Localized;
}

export interface TerminalSource {
    commands: readonly { command: string; result: string }[];
}

export interface SeoSource {
    title: Localized;
    description: Localized;
    cardAlt: Localized;
}

export interface SystemPageSource {
    label: Localized;
    heading: Localized;
    text: Localized;
    command: string;
    result: Localized;
}

export interface UiSource {
    skipToContent: Localized;
    languages: Localized;
    theme: Localized;
    sections: Localized;
    topBar: Localized;
    menu: { open: Localized; title: Localized };
    close: Localized;
    backToTop: Localized;
    home: Localized;
    present: Localized;
    external: Localized;
    copy: { label: Localized; done: Localized; status: Localized };
    motion: { pause: Localized; resume: Localized };
    viewer: {
        openScreenshot: Localized;
        openCertificate: Localized;
        previous: Localized;
        next: Localized;
    };
    notFound: SystemPageSource;
    error: SystemPageSource & { retry: Localized };
}

export interface ContentSource {
    site: SiteSource;
    profile: ProfileSource;
    hero: HeroSource;
    skills: SkillsSource;
    about: AboutSource;
    experience: ExperienceSource;
    achievements: AchievementsSource;
    projects: ProjectsSource;
    certifications: CertificationsSource;
    education: EducationSource;
    contact: ContactSource;
    terminal: TerminalSource;
    seo: SeoSource;
    ui: UiSource;
}

export type Content = Folded<ContentSource> & { readonly locale: Locale };
