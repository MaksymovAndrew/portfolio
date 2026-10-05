import type { ProjectsSource } from "types/content";

const screenshot = (index: number) => ({
    name: `cooking-assistant / screenshot-${index}`,
    // with the file in public/: { src, width, height, alt }
    image: null,
    caption: {
        en: `[Screenshot ${index} caption]`,
        pl: `[Podpis zrzutu ekranu ${index}]`,
        uk: `[Підпис знімка екрана ${index}]`,
    },
});

export const projects = {
    label: {
        en: "featured project",
        pl: "wyróżniony projekt",
        uk: "головний проєкт",
    },
    nav: { en: "Project", pl: "Projekt", uk: "Проєкт" },
    items: [
        {
            title: "Cooking Assistant",
            status: "live",
            description: {
                en: "A free cookbook for the home kitchen: keep recipes in one place, plan menus for the week, track your pantry and turn whatever is missing into a shopping list. In four languages.",
                pl: "Darmowa książka kucharska do domowej kuchni: przepisy w jednym miejscu, menu na cały tydzień, kontrola zapasów w spiżarni i lista zakupów z tego, czego brakuje. W czterech językach.",
                uk: "Безкоштовна кулінарна книга для домашньої кухні: рецепти в одному місці, меню на тиждень, облік запасів у коморі та список покупок із того, чого бракує. Чотирма мовами.",
            },
            screenshots: [screenshot(1), screenshot(2), screenshot(3)],
            story: {
                en: "Started as a duo project with [Milana](@milana) - later I rebuilt it on my own: full redesign, deep refactor, complete test suite and end-to-end CI/CD.",
                pl: "Projekt zaczął się jako duet z [Milaną](@milana) - później przebudowałem go samodzielnie: pełny redesign, głęboka refaktoryzacja, komplet testów i CI/CD od początku do końca.",
                uk: "Проєкт починався як дует із [Міланою](@milana) - згодом я перебудував його самостійно: повний редизайн, глибокий рефакторинг, повний набір тестів і наскрізний CI/CD.",
            },
            // addresses for [text](@key) links in the story and the bullets
            refs: { milana: "https://github.com/PershynaMilana" },
            bullets: [
                {
                    en: "**2,800+ tests** in 500+ files: Jest on both sides, Playwright e2e and a real-Postgres suite - 95%+ coverage, 80% gate in CI",
                    pl: "**2800+ testów** w 500+ plikach: Jest po obu stronach, Playwright e2e i zestaw na prawdziwym Postgresie - pokrycie 95%+, próg 80% w CI",
                    uk: "**2800+ тестів** у 500+ файлах: Jest з обох боків, Playwright e2e і набір на справжньому Postgres - покриття 95%+, поріг 80% у CI",
                },
                {
                    en: "**15+ CI jobs** on every PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, production build, e2e and database suites",
                    pl: "**15+ jobów CI** przy każdym PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, build produkcyjny, testy e2e i bazy danych",
                    uk: "**15+ джобів CI** на кожен PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, продакшн-збірка, e2e-тести й тести бази даних",
                },
                {
                    en: "Migrated from Vite to the **Next.js App Router**: server-rendered pages and rich link previews",
                    pl: "Migracja z Vite na **Next.js App Router**: strony renderowane na serwerze i bogate podglądy linków",
                    uk: "Міграція з Vite на **Next.js App Router**: серверний рендеринг сторінок і розширені превʼю посилань",
                },
                {
                    en: "Tag-driven deploys to a **self-hosted ARM server** on Oracle Cloud: arm64 images in GHCR, health checks, automatic rollback",
                    pl: "Wdrożenia po tagu na **własny serwer ARM** w Oracle Cloud: obrazy arm64 w GHCR, health checki, automatyczny rollback",
                    uk: "Деплой за тегом на **власний ARM-сервер** в Oracle Cloud: образи arm64 у GHCR, health-чеки, автоматичний відкат",
                },
                {
                    en: "JWT auth in httpOnly cookies, zod validation, nonce-based CSP, 10+ rate limiters",
                    pl: "JWT w cookies httpOnly, walidacja zod, CSP z nonce, 10+ rate limiterów",
                    uk: "JWT у httpOnly cookies, валідація zod, CSP з nonce, 10+ rate limiters",
                },
            ],
            tags: [
                "Next.js",
                "React",
                "TypeScript",
                "Redux Toolkit",
                "SCSS Modules",
                "Express 5",
                "PostgreSQL",
                "Jest",
                "Playwright",
                "Docker",
                "GitHub Actions",
            ],
            links: [
                {
                    label: {
                        en: "Production",
                        pl: "Produkcja",
                        uk: "Продакшн",
                    },
                    href: "https://cooking-assistant.app",
                },
                {
                    label: { en: "Source", pl: "Kod źródłowy", uk: "Код" },
                    href: "https://github.com/MaksymovAndrew/cooking-assistant",
                },
            ],
        },
    ],
} satisfies ProjectsSource;
