import type { AchievementsSource } from "types/content";

export const achievements = {
    label: {
        en: "what I've shipped",
        pl: "co dostarczyłem",
        uk: "мої здобутки",
    },
    nav: { en: "Shipped", pl: "Osiągnięcia", uk: "Здобутки" },
    fileName: "achievements.diff",
    items: [
        {
            en: "Built **PostHog product analytics from scratch** across registration and deposit funnels - 10+ key user events, first-ever visibility into drop-off points",
            pl: "Wdrożyłem od zera **analitykę produktową PostHog** dla lejków rejestracji i wpłat - ponad 10 kluczowych zdarzeń i pełny obraz punktów odpływu użytkowników",
            uk: "Впровадив з нуля **продуктову аналітику PostHog** для воронок реєстрації та депозитів - 10+ ключових подій і повна картина точок відтоку користувачів",
        },
        {
            en: "Migrated a production codebase from **~20% to ~70% TypeScript coverage**, unblocking CI quality gates for the team",
            pl: "Zmigrowałem produkcyjny kod z **~20% do ~70% pokrycia TypeScriptem**, odblokowując quality gates w CI dla zespołu",
            uk: "Мігрував продакшн-кодову базу з **~20% до ~70% покриття TypeScript**, розблокувавши quality gates у CI для команди",
        },
        {
            en: "Raised unit test coverage to **~80%** across critical frontend components (Jest + SonarQube)",
            pl: "Podniosłem pokrycie testami jednostkowymi do **~80%** w krytycznych komponentach frontendu (Jest + SonarQube)",
            uk: "Підняв покриття юніт-тестами до **~80%** у критичних фронтенд-компонентах (Jest + SonarQube)",
        },
        {
            en: "Refactored mobile scroll architecture - recovering **up to 10% of visible screen space** on mobile",
            pl: "Przebudowałem architekturę przewijania na mobile - odzyskując **do 10% widocznej przestrzeni ekranu**",
            uk: "Переробив архітектуру мобільного скролу - звільнив **до 10% видимої площі екрана** на мобільних",
        },
        {
            en: "Implemented **Google OAuth & multi-step registration** with correct redirects across 100% of auth scenarios",
            pl: "Wdrożyłem **Google OAuth i wieloetapową rejestrację** z poprawnymi przekierowaniami w 100% scenariuszy logowania",
            uk: "Реалізував **Google OAuth і багатокрокову реєстрацію** з коректними редіректами у 100% сценаріїв авторизації",
        },
        {
            en: "Enhanced deposit-flow UX with real-time timers and **alternative payment-method fallback** on transaction failures",
            pl: "Ulepszyłem UX przepływu wpłat: liczniki w czasie rzeczywistym i **przełączanie na alternatywną metodę płatności** przy błędach transakcji",
            uk: "Покращив UX депозитного флоу: таймери в реальному часі та **перехід на альтернативний метод оплати** при збоях транзакцій",
        },
    ],
} satisfies AchievementsSource;
