import type { ExperienceSource } from "types/content";

export const experience = {
    label: { en: "experience", pl: "doświadczenie", uk: "досвід" },
    nav: { en: "Experience", pl: "Doświadczenie", uk: "Досвід" },
    entries: [
        {
            role: "Junior Software Engineer",
            organisation: "TenThousand",
            meta: {
                en: "iGaming platform · Remote",
                pl: "platforma iGaming · zdalnie",
                uk: "iGaming-платформа · віддалено",
            },
            period: { start: "2024-06", end: "2026-05" },
            text: {
                en: "Built and maintained UI features for a production-scale iGaming platform with React, TypeScript and SCSS.",
                pl: "Tworzyłem i utrzymywałem funkcje UI produkcyjnej platformy iGaming w React, TypeScript i SCSS.",
                uk: "Розробляв і підтримував UI-функціонал продакшн-платформи iGaming на React, TypeScript і SCSS.",
            },
            bullets: [
                {
                    en: "REST APIs and **WebSocket** connections for real-time data synchronization",
                    pl: "REST API i połączenia **WebSocket** do synchronizacji danych w czasie rzeczywistym",
                    uk: "REST API та **WebSocket**-зʼєднання для синхронізації даних у реальному часі",
                },
                {
                    en: "Unit tests with **Jest**, components documented in **Storybook**",
                    pl: "Testy jednostkowe w **Jest**, dokumentacja komponentów w **Storybook**",
                    uk: "Юніт-тести на **Jest**, документація компонентів у **Storybook**",
                },
                {
                    en: "Shared internal **UI libraries** across multiple repositories, published via Nexus",
                    pl: "Współdzielone wewnętrzne **biblioteki UI** w wielu repozytoriach, publikowane przez Nexus",
                    uk: "Спільні внутрішні **UI-бібліотеки** для кількох репозиторіїв, публікація через Nexus",
                },
                {
                    en: "Code quality through **SonarQube** quality gates and **GitLab CI/CD** pipelines",
                    pl: "Jakość kodu dzięki quality gates **SonarQube** i pipeline'om **GitLab CI/CD**",
                    uk: "Якість коду через quality gates **SonarQube** і пайплайни **GitLab CI/CD**",
                },
                {
                    en: "Code reviews, sprint planning, task estimation and internal developer docs",
                    pl: "Code review, planowanie sprintów, estymacja zadań i wewnętrzna dokumentacja",
                    uk: "Код-ревʼю, планування спринтів, оцінювання задач і внутрішня документація",
                },
            ],
            tags: [
                "React",
                "TypeScript",
                "SCSS",
                "Redux",
                "WebSockets",
                "Jest",
                "Storybook",
                "GitLab CI/CD",
                "SonarQube",
            ],
        },
    ],
} satisfies ExperienceSource;
