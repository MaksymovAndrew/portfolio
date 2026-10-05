import type { ProfileSource } from "types/content";

export const profile = {
    name: "Andrii Maksymov",
    initials: "AM",
    city: "Wrocław",
    timeZone: "Europe/Warsaw",
    availability: {
        en: "open to work",
        pl: "otwarty na oferty",
        uk: "відкритий до пропозицій",
    },
    email: "maksymov.andrew@gmail.com",
    links: [
        {
            id: "github",
            label: "GitHub",
            href: "https://github.com/MaksymovAndrew",
        },
        {
            id: "linkedin",
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/andrewmaksymov",
        },
        {
            id: "telegram",
            label: "Telegram",
            href: "https://t.me/Andrew_Maksymov",
        },
    ],
    // with public/cv.pdf in place: { href: "/cv.pdf", label: "CV" }
    cv: null,
    languages: [
        {
            code: "en",
            name: { en: "English", pl: "angielski", uk: "англійська" },
            level: { en: "C1", pl: "C1", uk: "C1" },
        },
        {
            code: "pl",
            name: { en: "Polish", pl: "polski", uk: "польська" },
            level: { en: "B1", pl: "B1", uk: "B1" },
        },
        {
            code: "uk",
            name: { en: "Ukrainian", pl: "ukraiński", uk: "українська" },
            level: { en: "native", pl: "ojczysty", uk: "рідна" },
        },
    ],
} satisfies ProfileSource;
