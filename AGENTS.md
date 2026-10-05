# AGENTS.md

Guidance for AI coding agents and human contributors working in this repository.

## What this is

A personal portfolio site that doubles as a template. Everything personal lives in three folders; everything else is framework.

## The one rule

| Task                                                 | Touch only |
| ---------------------------------------------------- | ---------- |
| Change words, facts, links, languages, section order | `content/` |
| Change colours, fonts, radii                         | `theme/`   |
| Replace the CV or images                             | `public/`  |
| Change behaviour or layout                           | `src/`     |

`src/` holds no personal data, no raw colours and no user-facing text. If a task needs a literal name, colour or sentence inside `src/`, the task belongs in `content/` or `theme/` instead.

## Content

- `content/index.ts` assembles `source`, checked against `ContentSource` in `src/types/content.ts`. A translatable field is `Localized`: one string for every language of `content/locales.ts`.
- Components know nothing about languages: a page calls `getContent(locale)` from `i18n/content` and passes the strings of one language down through props. Only `src/i18n/` and `src/guards/` import `content/`.
- Markup (`**bold**`, `*accent*`, `[label](target)`) is allowed only in the rich fields listed in `src/i18n/fields.ts`. `RichText` renders it, `toPlainText` strips it for meta tags and images; never `dangerouslySetInnerHTML`.
- Addresses: the default language lives at `/`, every other one under its prefix. `proxy.ts` applies the pure `createLocaleRouting` from `i18n/routing`; links take their address from `localePath` in `i18n/paths`, never from a hand-written `/${locale}`. The 404 view gets its texts from `useSystemMessages`: Next passes it no params.
- `validateContent` reports broken content with the path of each field. The first `getContent` call of a build runs it, so broken content fails the build.

## Theme

- `theme/theme.ts` holds both palettes; `buildThemeCss` turns them into CSS variables in the root layout. Components use `var(--token)` and the SCSS tokens of `styles/abstracts` (`$font-*`, `$dur-*`, `$ease-*`, `$z-*`, `$radius-*`, the breakpoint mixins); Stylelint rejects raw colours, z-indexes, radii, font families, durations and easings. Only `src/app/`, `src/components/social/` and `src/guards/` import `theme/`.
- The theme lives in `data-theme` on `<html>`: the inline pre-paint script sets it from storage, `themeStore` changes it later. A component shows a per-theme part through CSS (`:global(:root[data-theme="light"])`), never by reading the mode while rendering.
- Storage goes through `utils/storage`: a blocked storage keeps the feature working for the visit.

## Working rules

- Conventional Commits. Every change goes through its own branch and a squash-merged pull request; nothing is committed straight to `main`.
- The pull request title becomes the commit title, so it follows the same rules. CI checks it and runs every check of `verify`, the browser tests and Lighthouse on each pull request; `ci-success` must be green before a merge.
- Commit messages and pull request texts describe the change and nothing else - no trailers.
- A change is done only when `npm run verify`, `npm run test:e2e` and `npm run lighthouse` are green: run them for real and report failures with their output. On Windows with Smart App Control, WebKit cannot start: the README names the browser subset to run there.
- No `as any`, `@ts-ignore`, `eslint-disable` or empty `catch`.
- Comments are a last resort: one short line, only where the code is genuinely confusing.
- A condition with three or more parts becomes a named constant.
- Read the relevant code before writing, and match the surrounding style.
- Tests assert behaviour, not coverage numbers. Mock only what is strictly necessary.

## Stack

Next.js 16 (App Router, static generation per language, standalone output), React 19, TypeScript 6 strict, SCSS Modules, Node.js 24, npm. Checks: ESLint, Stylelint, Prettier, Jest, Playwright with axe, Lighthouse.

## Commands

| Command              | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Development server                                         |
| `npm run build`      | Production build; every page is generated statically       |
| `npm start`          | Serve the production build with the server that ships      |
| `npm run typecheck`  | Type check                                                 |
| `npm run bump`       | Set the release version in `package.json` and the lockfile |
| `npm run verify`     | Every check below, then the production build               |
| `npm run test:e2e`   | Browser tests on the production build (Playwright, axe)    |
| `npm run lighthouse` | Lighthouse thresholds on the last production build         |

`verify` runs, in order: `format:check`, `lint`, `lint:sonarjs`, `stylelint`, `typecheck`, `test:coverage`, `build`. Each is its own script; `format`, `lint:fix` and `stylelint:fix` repair what can be repaired automatically.

A release goes through a `chore/release-X.Y.Z` branch: there the commit hook takes the version from the branch name (`npm run bump` does the same by hand). Never edit the version by hand.

## Tests

- Jest with React Testing Library; a test lives in `__tests__/<Unit>.test.ts(x)` next to its subject and is named `it("should ...")`.
- `act` instead of `waitFor`; an async server component is tested as `render(await Page(props))`.
- Tests never hard-code the languages: take `LOCALES` and `DEFAULT_LOCALE` from `i18n/locales`.
- Components are rendered with the fictional person of `test/fixtures/content`: `content` is folded, `contentSource` is the same person before folding. Only `src/i18n/` and `src/guards/` read the real content.
- A route handler test starts with `/** @jest-environment node */`.
- Browser tests live in `e2e/` and run against the production build. A spec imports `test` and `expect` from `e2e/support/test` (a console error or an uncaught exception fails the test) and iterates `LOCALES`, `WIDTHS` and `THEMES` from `e2e/support/site` (`storeTheme` stores a theme choice before the page opens); `expectAccessible` from `e2e/support/axe` runs the WCAG 2.2 AA rules.
