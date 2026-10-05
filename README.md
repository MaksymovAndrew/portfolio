# Portfolio

A personal portfolio site built with Next.js: one page, generated ahead of time for every language. It doubles as a template - everything personal lives in three folders, and the rest is framework you do not have to touch.

> Work in progress: the scaffold is in place, the sections and the design are on their way.

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

Then open <http://localhost:3000/en>. Every language has its own address: `/en`, `/pl`, `/uk`.

## Commands

| Command             | What it does                                                |
| ------------------- | ----------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                          |
| `npm run build`     | Production build: every page is generated ahead of time     |
| `npm start`         | Serves the production build with the same server that ships |
| `npm run typecheck` | Type check of the whole project                             |
| `npm run bump`      | Sets the release version in `package.json` and the lockfile |

`npm start` needs a build first and listens on `127.0.0.1:3000`; set `PORT` or `SERVE_HOST` to change that.

`npm run bump` takes the version from the branch name on a `chore/release-X.Y.Z` branch; anywhere else pass it: `npm run bump -- 1.2.3`. On a release branch the commit hook does the same by itself.

## Quality checks

| Command                 | What it checks                                                                |
| ----------------------- | ----------------------------------------------------------------------------- |
| `npm run verify`        | Everything below, then the production build                                   |
| `npm run format:check`  | Formatting (Prettier); `npm run format` fixes it                              |
| `npm run lint`          | ESLint: types, imports, accessibility, the layer rules                        |
| `npm run lint:sonarjs`  | Code smells and cognitive complexity                                          |
| `npm run stylelint`     | Styles: no raw colours; radii, layers, fonts and timings come from the tokens |
| `npm run typecheck`     | Types of the app, the build config and the tests                              |
| `npm run test:coverage` | Unit tests (Jest, React Testing Library) with an 80% coverage threshold       |

The lint rules keep the layers apart: text in a component, a raw colour or an import of `content/` outside `src/i18n/` fails the check.

Git hooks are installed by `npm install`. A commit fixes and formats the staged files and runs the type check; a commit message must follow [Conventional Commits](https://www.conventionalcommits.org/) with a header of at most 72 characters; a direct push to `main` is refused.

## Project layout

| Folder     | Holds                                         |
| ---------- | --------------------------------------------- |
| `content/` | Words, facts, links and the list of languages |
| `theme/`   | Colours and fonts                             |
| `public/`  | The CV and images                             |
| `src/`     | Behaviour and layout - the framework          |

To make the site your own, change `content/`, `theme/` and `public/`. `src/` holds no personal data, no raw colours and no user-facing text.

`theme/` is not there yet: it arrives together with the design. The languages are listed in `content/locales.ts`.

## Licence

The code is released under the [MIT licence](LICENSE). The personal content in `content/` and `public/` - texts, images, the CV - is not part of that grant: replace it with your own.
