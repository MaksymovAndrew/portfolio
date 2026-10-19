import type { HeroSource } from "types/content";

export const hero = {
    eyebrow: {
        en: "Frontend Developer - React & TypeScript",
        pl: "Frontend Developer - React i TypeScript",
        uk: "Frontend Developer - React і TypeScript",
    },
    tagline: {
        en: "I build *fast, tested, production-grade* web interfaces.",
        pl: "Tworzę *szybkie, dokładnie przetestowane* interfejsy webowe gotowe na produkcję.",
        uk: "Створюю *швидкі, ретельно протестовані* вебінтерфейси, готові до продакшну.",
    },
    sub: {
        en: "2 years of commercial experience shipping UI for a production-scale iGaming platform. Based in Wrocław, Poland - open to remote opportunities.",
        pl: "2 lata komercyjnego doświadczenia w tworzeniu UI dużej platformy iGaming. Mieszkam we Wrocławiu - szukam pracy w pełni zdalnej.",
        uk: "2 роки комерційного досвіду розробки UI для великої iGaming-платформи. Живу у Вроцлаві, Польща - розглядаю лише віддалену роботу.",
    },
    chips: ["tests passing", "types strict", "CI green"],
    actions: [
        {
            label: {
                en: "View my work",
                pl: "Zobacz moje prace",
                uk: "Мої роботи",
            },
            target: "projects",
            variant: "primary",
        },
        {
            label: {
                en: "Get in touch",
                pl: "Napisz do mnie",
                uk: "Зв’язатися",
            },
            target: "contact",
            variant: "ghost",
        },
    ],
} satisfies HeroSource;
