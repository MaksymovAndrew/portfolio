# Portfolio

[![CI](https://github.com/MaksymovAndrew/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MaksymovAndrew/portfolio/actions/workflows/ci.yml)

A personal portfolio site built with Next.js: one page, generated ahead of time for every language. It doubles as a template - everything personal lives in three folders, and the rest is framework you do not have to touch.

> Work in progress: the page frame, the first screen, the languages and the themes are in place, the sections are on their way.

## Stack

- Next.js 16 (App Router, static generation, standalone output)
- React 19, TypeScript 6 in strict mode
- SCSS Modules
- Node.js 24, npm

## Getting started

Requires Node.js 24 or newer (see `.nvmrc`).

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. English lives at the root, Polish at `/pl`, Ukrainian at `/uk`.

## Commands

| Command             | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                          |
| `npm run build`     | Production build: every page is generated ahead of time     |
| `npm start`         | Serves the production build with the same server that ships |
| `npm run typecheck` | Type check of the whole project                             |
| `npm run bump`      | Sets the release version in `package.json` and the lockfile |

`npm start` needs a build first and listens on `localhost:3000`; set `PORT` or `SERVE_HOST` to change that. Use a host name or `0.0.0.0`, never a loopback address such as `127.0.0.1` or `::1`: Next calls those `localhost` inside the proxy, and its rewrites stop finding the server.

`npm run bump` takes the version from the branch name on a `chore/release-X.Y.Z` branch; anywhere else pass it: `npm run bump -- 1.2.3`. On a release branch the commit hook does the same by itself.

## Quality checks

| Command                 | What it checks                                                                |
| ----------------------- | ----------------------------------------------------------------------------- |
| `npm run verify`        | Everything below, then the production build                                   |
| `npm run format:check`  | Formatting (Prettier); `npm run format` fixes it                              |
| `npm run lint`          | ESLint: types, imports, accessibility, the layer rules                        |
| `npm run lint:sonarjs`  | Code smells and cognitive complexity                                          |
| `npm run stylelint`     | Styles: no raw colours; radii, layers, fonts and timings come from the tokens |
| `npm run typecheck`     | Types of the app, the unit and browser tests and the TypeScript configs       |
| `npm run test:coverage` | Unit tests (Jest, React Testing Library) with an 80% coverage threshold       |

The lint rules keep the layers apart: text in a component, a raw colour or an import of `content/` from `src/` anywhere but `src/i18n/` and `src/guards/` fails the check.

Two more checks run on the production build, in real browsers:

- `npm run test:e2e` - Playwright builds the site and serves it on port 3100 (a server already running there is reused). Every language answers in Chromium, WebKit and Firefox; nothing scrolls sideways from 320 to 1440 pixels and axe finds no WCAG 2.2 AA violation, in both themes; the top bar gives way to the left column at 1024 pixels, with exactly one main heading on screen; the skip link leads to the content; the first screen's entry animation ends with every block in place, and under reduced motion every skill shows once and nothing moves; a stored theme applies before any script bundle runs; the page reads and its language links work without JavaScript; no page logs an error.
- `npm run lighthouse` - Lighthouse with mobile emulation on every language of the last `npm run build`. The median of three runs must meet the thresholds in `lighthouse.config.mjs`; the HTML reports land in `lighthouse-report/`.

Install the browsers once with `npx playwright install chromium webkit firefox`. On Windows with Smart App Control turned on, the unsigned WebKit build cannot start; run `npm run test:e2e -- --project=chromium --project=nojs` there - CI runs every browser.

Git hooks are installed by `npm install`. A commit fixes and formats the staged files and runs the type check; a commit message must follow [Conventional Commits](https://www.conventionalcommits.org/) with a header of at most 72 characters; a direct push to `main` is refused.

All of these checks run on GitHub Actions for every pull request and every push to `main`, together with a check that the pull request title follows Conventional Commits. One check, `ci-success`, sums them up: make it the required status check of `main`. Dependabot proposes dependency updates once a week: minor and patch npm updates arrive as one pull request, workflow actions as another, major versions one by one.

## Project layout

| Folder     | Holds                                         |
| ---------- | --------------------------------------------- |
| `content/` | Words, facts, links and the list of languages |
| `theme/`   | Colours and fonts                             |
| `public/`  | The CV and images                             |
| `src/`     | Behaviour and layout - the framework          |

To make the site your own, change `content/`, `theme/` and `public/`. `src/` holds no personal data, no raw colours and no user-facing text.

The languages are listed in `content/locales.ts`.

## Addresses and languages

| Address                                 | What it shows                                          |
| --------------------------------------- | ------------------------------------------------------ |
| `/`                                     | the page in the default language, English              |
| `/pl`, `/uk`                            | the page in Polish, in Ukrainian                       |
| `/en`, `/en/...`                        | a permanent redirect to the same address without `/en` |
| an unknown address under `/pl` or `/uk` | a 404 page in that language                            |
| any other unknown address               | a 404 page in the default language                     |

An unknown address that looks like a file - a dot in it, as in `/old.pdf` - skips this and gets the framework's plain 404. The languages and the default one come from `content/locales.ts`; the addresses follow them. The site never picks a language for the visitor and sets no cookies: the address alone decides.

## Changing the look

Two files hold the look:

- `theme/theme.ts` - both palettes, dark and light, with their tints, the two glow colours and the card radius. `defaultMode` is the theme a first visit opens in; `social.mode` is the one images of the site, such as link previews, are drawn in. The site writes these as CSS variables, so every colour on the page comes from here.
- `theme/fonts.ts` - the three fonts, loaded with `next/font/google`: downloaded at build time and served by the site itself, never from Google. A page fetches only the alphabets its text uses; the Latin files of all three and the Cyrillic file of the body font are preloaded, so the running text of the first screen is drawn in its own font from the start.

`theme/fonts/Unbounded-Bold.ttf` is a static copy of the heading font: the site icon is drawn from it, because the image renderer reads neither variable fonts nor woff2. Replace it together with the heading font, under the same name, and keep its licence next to it.

The icon is the initials from `content/profile.ts` with a dot in the accent colour. A visitor's theme choice is remembered in the browser and applied before the first paint; without a stored choice the site opens in `defaultMode`, whatever the system setting.

`npm run verify` checks the contrast of both palettes: every text colour on its backgrounds must reach 4.5:1, and a failure names the pair and its ratio.

## Editing content

Every word on the site lives in `content/`, one file per part of the page, with all languages side by side:

```ts
tagline: {
    en: "I build *fast, tested, production-grade* web interfaces.",
    pl: "Tworzę *szybkie, dokładnie przetestowane* interfejsy webowe gotowe na produkcję.",
    uk: "Я створюю *швидкі, ретельно протестовані* вебінтерфейси production-рівня.",
},
```

A text missing in one of the languages fails the type check. Names, technologies, links and numbers that read the same everywhere are written once.

`sections` in `content/site.ts` decides which sections the page shows and in what order: move a line to move a section, delete it to hide one. The same file holds the footer's credit line and the technologies listed next to the version.

The hero tagline, the About paragraphs, the experience bullets, the achievements and the project story and bullets accept a small markup; every other field shows its text exactly as written.

| Write                  | Get                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `**words**`            | bold                                                                                                                                                |
| `*words*`              | accent                                                                                                                                              |
| `[label](target)`      | a link to `https://...`, `mailto:...`, `#section`, `/path`, or `@key` - an address written once under `refs` of the About section or of the project |
| `\*`, `\[`, `\]`, `\)` | the character itself                                                                                                                                |

Markup cannot be nested, and an address with parentheses goes under `refs`. `npm run verify` checks the content and names the field of every problem: an empty text, broken markup, an unknown `@key`, a link that is not https, mail, an anchor or a site path, a file missing from `public/`, a section listed twice, a button pointing at a section that is not on the page, a month not written as `YYYY-MM`. The same check stops the production build, and a test fails when the name, the email or a profile link from `content/profile.ts` appears in `src/`.

## Licence

The code is released under the [MIT licence](LICENSE). The personal content in `content/` and `public/` - texts, images, the CV - is not part of that grant: replace it with your own.
