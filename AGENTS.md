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

## Working rules

- Conventional Commits. Every change goes through its own branch and a squash-merged pull request; nothing is committed straight to `main`.
- The pull request title becomes the commit title, so it follows the same rules. CI checks it and runs every check of `verify` on each pull request; `ci-success` must be green before a merge.
- Commit messages and pull request texts describe the change and nothing else - no trailers.
- Run `npm run verify` for real before calling anything done, and report failures with their output.
- No `as any`, `@ts-ignore`, `eslint-disable` or empty `catch`.
- Comments are a last resort: one short line, only where the code is genuinely confusing.
- A condition with three or more parts becomes a named constant.
- Read the relevant code before writing, and match the surrounding style.
- Tests assert behaviour, not coverage numbers. Mock only what is strictly necessary.

## Stack

Next.js 16 (App Router, static generation per language, standalone output), React 19, TypeScript 6 strict, SCSS Modules, Node.js 24, npm. Checks: ESLint, Stylelint, Prettier, Jest.

## Commands

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Development server                                         |
| `npm run build`     | Production build; every page is generated statically       |
| `npm start`         | Serve the production build with the server that ships      |
| `npm run typecheck` | Type check                                                 |
| `npm run bump`      | Set the release version in `package.json` and the lockfile |
| `npm run verify`    | Every check below, then the production build               |

`verify` runs, in order: `format:check`, `lint`, `lint:sonarjs`, `stylelint`, `typecheck`, `test:coverage`, `build`. Each is its own script; `format`, `lint:fix` and `stylelint:fix` repair what can be repaired automatically.

A release goes through a `chore/release-X.Y.Z` branch: there the commit hook takes the version from the branch name (`npm run bump` does the same by hand). Never edit the version by hand.

## Tests

- Jest with React Testing Library; a test lives in `__tests__/<Unit>.test.ts(x)` next to its subject and is named `it("should ...")`.
- `act` instead of `waitFor`; an async server component is tested as `render(await Page(props))`.
- Tests never hard-code the languages: take `LOCALES` and `DEFAULT_LOCALE` from `i18n/locales`.
- A route handler test starts with `/** @jest-environment node */`.
