import type { AchievementsSource } from "types/content";

export const achievements = {
    label: {
        en: "what I've shipped",
        pl: "co wdrożyłem",
        uk: "мої здобутки",
    },
    nav: { en: "Shipped", pl: "Osiągnięcia", uk: "Здобутки" },
    fileName: "achievements.diff",
    items: [
        {
            en: "Built **PostHog product analytics from scratch** across registration and deposit funnels - 10+ key user events, first-ever visibility into drop-off points",
            pl: "Wdrożyłem od zera **analitykę produktową PostHog** w lejkach rejestracji i wpłat - ponad 10 kluczowych zdarzeń i po raz pierwszy jasny obraz tego, gdzie użytkownicy rezygnują",
            uk: "Впровадив з нуля **продуктову аналітику PostHog** для воронок реєстрації та депозитів - 10+ ключових подій і вперше чітка картина того, де саме користувачі залишають воронку",
        },
        {
            en: "Migrated a production codebase from **~20% to ~70% TypeScript coverage**, unblocking CI quality gates for the team",
            pl: "Zwiększyłem pokrycie TypeScriptem produkcyjnego kodu **z ~20% do ~70%**, co odblokowało zespołowi quality gates w CI",
            uk: "Розширив покриття TypeScript у продакшн-коді **з ~20% до ~70%**, що розблокувало для команди quality gates у CI",
        },
        {
            en: "Raised unit test coverage to **~80%** across critical frontend components (Jest + SonarQube)",
            pl: "Podniosłem pokrycie testami jednostkowymi do **~80%** w krytycznych komponentach frontendu (Jest + SonarQube)",
            uk: "Підняв покриття юніт-тестами до **~80%** у критичних фронтенд-компонентах (Jest + SonarQube)",
        },
        {
            en: "Refactored mobile scroll architecture - recovering **up to 10% of visible screen space** on mobile",
            pl: "Przebudowałem przewijanie w wersji mobilnej, odzyskując **do 10% widocznej powierzchni ekranu**",
            uk: "Переробив скрол у мобільній версії - звільнив **до 10% видимої площі екрана**",
        },
        {
            en: "Implemented **Google OAuth & multi-step registration** with correct redirects across 100% of auth scenarios",
            pl: "Wdrożyłem **Google OAuth i wieloetapową rejestrację** z poprawnymi przekierowaniami w 100% scenariuszy logowania",
            uk: "Реалізував **Google OAuth і багатокрокову реєстрацію** з коректними редіректами у 100% сценаріїв авторизації",
        },
        {
            en: "Enhanced deposit-flow UX with real-time timers and **alternative payment-method fallback** on transaction failures",
            pl: "Ulepszyłem UX przepływu wpłat: liczniki w czasie rzeczywistym i **przełączanie na alternatywną metodę płatności** przy błędach transakcji",
            uk: "Покращив UX поповнення рахунку: таймери в реальному часі та **перехід на альтернативний метод оплати** при збоях транзакцій",
        },
    ],
} satisfies AchievementsSource;
