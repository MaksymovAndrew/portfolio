# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Statically generated pages for English, Polish and Ukrainian.
- A command that sets the release version from the release branch name.
- One command, `npm run verify`, that runs formatting, linting, style checks, type checks, unit tests and the production build.
- Lint rules that keep text, colours and personal data out of the framework code.
- Git hooks: staged files are fixed on commit, commit messages follow Conventional Commits, direct pushes to `main` are refused.
- Every pull request runs formatting, linting, style checks, type checks, unit tests and the production build, and its title is checked against Conventional Commits.
- Weekly grouped dependency updates for npm packages and workflow actions.
- Browser tests on the production build in Chromium, WebKit and Firefox.
- An automatic accessibility check (WCAG 2.2 AA rules) for every language.
- A layout check: no horizontal scroll from 320 to 1440 pixels, for every language.
- A check that the page stays readable with JavaScript turned off.
- Lighthouse on every pull request, with thresholds for accessibility, best practices, SEO, layout shift and the size of scripts, fonts and the whole page.
- All site texts in English, Polish and Ukrainian, kept side by side in `content/`; a missing translation fails the type check.
- Bold, accent and links inside texts through a small safe markup, without raw HTML.
- Automatic checks for empty texts, broken markup and links, missing files and malformed dates; broken content stops the build.
- A check that keeps the owner's name, email and profile links out of the framework code.
- English at the root address, Polish at `/pl`, Ukrainian at `/uk`; `/en` redirects to the root, so every page has one address.
- Unknown addresses answer 404 with a page in the language of the address, readable without JavaScript.
- Dark and light themes; the choice is remembered and applied before the first paint.
- One file with both palettes: every colour on the site comes from it.
- Three self-hosted fonts with Polish and Ukrainian letters; a page loads only the letters it uses, and the Latin letters of all three and the Cyrillic of the running text are preloaded.
- A site icon generated from the initials and the accent colour.
- An automatic contrast check: every text colour passes WCAG AA in both themes.
- Two-column layout from 1024 pixels with a sticky left column; a top bar on tablets and phones.
- Language links that work without JavaScript.
- A skip-to-content link, a footer with the version, and a background glow.
- The sections are listed in `content/site.ts`: reorder or remove them there.
- First screen: role, name, tagline, short summary, three status chips and two buttons.
- Two rows of skills moving towards each other, pausing under the pointer.
- With reduced motion the skills are shown as a static wrapped list.
- About section with highlighted key phrases and the spoken languages.
- Experience section: role, period, company, summary, responsibilities and technologies.
- Achievements shown as a diff file with six shipped results.
- Featured project card: description, screenshots, the story of the project, key facts, technologies and links.
- Image viewer: opens from a thumbnail, arrows and keyboard arrows switch images, Escape closes it.
- Placeholders where an image is not available yet.
- Certifications list; each certificate opens in the viewer with its credential ID and links to its verification page.
- Education section.
- Contact section with the email address, a one-click copy button and links to GitHub, LinkedIn and Telegram.
- The copy is announced to screen readers; without clipboard access the address is selected instead.

### Fixed

- Editors type-check the tests, the browser tests and the TypeScript configs with the project's settings instead of reporting false errors.
