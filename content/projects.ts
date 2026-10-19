import type { Localized, ProjectsSource } from "types/content";

const screenshot = (index: number, caption: Localized, alt: Localized) => ({
    name: `cooking-assistant / screenshot-${index}`,
    image: {
        src: `/images/projects/cooking-assistant/screenshot-${index}.webp`,
        width: 1600,
        height: 1000,
        alt,
    },
    caption,
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
            screenshots: [
                screenshot(
                    1,
                    {
                        en: "Scale any recipe to the people at your table and see which ingredients you still need.",
                        pl: "Przelicz dowolny przepis na liczbę osób przy stole i od razu sprawdź, których składników brakuje.",
                        uk: "Перерахуйте будь-який рецепт на кількість людей за столом і одразу побачте, яких інгредієнтів бракує.",
                    },
                    {
                        en: "Cooking Assistant recipe page: shakshuka for four, with the ingredient list and the missing ones highlighted",
                        pl: "Strona przepisu w Cooking Assistant: szakszuka dla czterech osób, lista składników z wyróżnionymi brakującymi",
                        uk: "Сторінка рецепта в Cooking Assistant: шакшука на чотирьох, список інгредієнтів із виділеними відсутніми",
                    },
                ),
                screenshot(
                    2,
                    {
                        en: "Plan the week's dinners in a single menu and check every ingredient against your pantry.",
                        pl: "Zaplanuj kolacje na cały tydzień w jednym menu i porównaj wszystkie składniki z zawartością spiżarni.",
                        uk: "Плануйте вечері на тиждень в одному меню й звіряйте всі інгредієнти із запасами в коморі.",
                    },
                    {
                        en: "Cooking Assistant menu page: six dinners with photos and the menu's ingredients checked against the pantry",
                        pl: "Strona menu w Cooking Assistant: sześć kolacji ze zdjęciami i składniki menu porównane ze spiżarnią",
                        uk: "Сторінка меню в Cooking Assistant: шість страв на вечерю з фото та інгредієнти меню, звірені з коморою",
                    },
                ),
                screenshot(
                    3,
                    {
                        en: "Shop from a list of what your meals are missing and tick things off.",
                        pl: "Rób zakupy z listy tego, czego brakuje do zaplanowanych dań, i odhaczaj kupione rzeczy.",
                        uk: "Купуйте за списком того, чого бракує для ваших страв, і відмічайте куплене.",
                    },
                    {
                        en: "Cooking Assistant shopping list: items to buy on the left, the ones already bought ticked off on the right",
                        pl: "Lista zakupów w Cooking Assistant: produkty do kupienia po lewej, kupione odhaczone po prawej",
                        uk: "Список покупок у Cooking Assistant: що купити - ліворуч, уже куплене позначено праворуч",
                    },
                ),
            ],
            story: {
                en: "Started as a duo project with [Milana](@milana) - later I rebuilt it on my own: full redesign, deep refactor, complete test suite and end-to-end CI/CD.",
                pl: "Projekt powstał w duecie z [Milaną](@milana) - później przebudowałem go samodzielnie: pełny redesign, gruntowna refaktoryzacja, komplet testów i pełne CI/CD.",
                uk: "Проєкт ми починали вдвох із [Міланою](@milana) - згодом я перебудував його самотужки: повний редизайн, глибокий рефакторинг, повний набір тестів і повноцінний CI/CD.",
            },
            // addresses for [text](@key) links in the story and the bullets
            refs: { milana: "https://github.com/PershynaMilana" },
            bullets: [
                {
                    en: "**2,800+ tests** in 500+ files: Jest on both sides, Playwright e2e and a real-Postgres suite - 95%+ coverage, 80% gate in CI",
                    pl: "**2800+ testów** w 500+ plikach: Jest po obu stronach, Playwright e2e i testy na prawdziwej bazie Postgres - pokrycie 95%+, próg 80% w CI",
                    uk: "**2800+ тестів** у 500+ файлах: Jest з обох боків, Playwright e2e і тести на справжній базі Postgres - покриття 95%+, поріг 80% у CI",
                },
                {
                    en: "**15+ CI jobs** on every PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, production build, e2e and database suites",
                    pl: "**15+ jobów CI** przy każdym PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, build produkcyjny, testy e2e i bazy danych",
                    uk: "**15+ джобів CI** на кожен PR: Prettier, ESLint, tsc, SonarJS, Stylelint, Jest, продакшн-збірка, e2e-тести й тести бази даних",
                },
                {
                    en: "Migrated from Vite to the **Next.js App Router**: server-rendered pages and rich link previews",
                    pl: "Migracja z Vite na **Next.js App Router**: strony renderowane na serwerze i rozbudowane podglądy linków",
                    uk: "Міграція з Vite на **Next.js App Router**: серверний рендеринг сторінок і розширені прев’ю посилань",
                },
                {
                    en: "Tag-driven deploys to a **self-hosted ARM server** on Oracle Cloud: arm64 images in GHCR, health checks, automatic rollback",
                    pl: "Wdrożenia uruchamiane tagiem na **własny serwer ARM** w Oracle Cloud: obrazy arm64 w GHCR, health checki, automatyczny rollback",
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
