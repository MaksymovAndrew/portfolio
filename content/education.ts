import type { EducationSource } from "types/content";

export const education = {
    label: { en: "education", pl: "wykształcenie", uk: "освіта" },
    nav: { en: "Education", pl: "Wykształcenie", uk: "Освіта" },
    entries: [
        {
            field: {
                en: "Software Engineering",
                pl: "Inżynieria oprogramowania",
                uk: "Інженерія програмного забезпечення",
            },
            organisation:
                "Akademia Techniczno-Artystyczna Nauk Stosowanych w Warszawie",
            faculty: "Wydział Wrocławska Akademia Biznesu",
            degree: {
                en: "Engineer's degree",
                pl: "studia inżynierskie",
                uk: "ступінь інженера",
            },
            period: { start: "2024-10", end: null },
        },
    ],
} satisfies EducationSource;
