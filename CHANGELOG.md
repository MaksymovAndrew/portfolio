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
- The left column lists the sections and highlights the one being read.
- On phones and tablets: a sticky top bar, a bottom menu with all sections and a back-to-top button.
- Changing the language keeps the section you were reading, with a short fade where the browser supports it.
- A small terminal at the bottom of the left column types commands, and a status line shows the local time; the status line is in the bottom menu too.
- A "pause animations" button in the footer freezes everything that moves by itself and remembers the choice; with reduced motion it is not shown, as nothing moves.
- With a mouse: a soft light and a custom cursor follow the pointer, the main buttons pull towards it and the project card tilts; touch devices do not load this code, and reduced motion or high-contrast settings turn it off.
- Blocks rise into place as they scroll into view.
- The theme changes with a circle growing from the button.
- Selected text and the scrollbar take the colours of the theme.
- `npm start` and `npm run dev` open on phones and other devices on the same network too; `npm start` prints the address to open.
- Every language has its own title, description, canonical address and links to the other languages, including a default for readers of none of them.
- Link previews on social networks and messengers get the title, description, address and language of the page.
- Structured data describes the person: role, city, profile links, languages, education and certificates.
- A sitemap with every language, robots rules that point to it, and a web manifest with app icons.
- The production build requires the public site address in `NEXT_PUBLIC_SITE_URL` and stops with a clear error without it.

### Fixed

- Editors type-check the tests, the browser tests and the TypeScript configs with the project's settings instead of reporting false errors.
- The left column and the menu mark the section a link was chosen for, even a short one or one at the very end of the page; the last section is marked once the page is scrolled to its end.
- A click on a menu item with Ctrl, Cmd or Shift opens it elsewhere and leaves the menu as it is; an open menu closes when the window grows wide enough for the left column.
- An old file address under a language prefix, such as `/pl/old.pdf`, answers with the 404 page in that language.
- The theme, menu, copy and pause buttons appear only once they work, instead of ignoring clicks while the page is still loading.
- On iPhone the top bar covers the area under the clock and no longer shakes while the page scrolls.
- The top bar stands still while the page opens instead of sliding into place.
- The label of a missing image wraps between its words in a small box instead of leaving a bracket on a line of its own.
