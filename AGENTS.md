# AGENTS.md

Guidance for AI coding agents and human contributors working in this repository.

## What this is

The personal portfolio site of Andrii Maksymov: one page in three languages, generated ahead of time. Everything personal lives in three folders; everything else is the code that draws it.

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
- Addresses: the default language lives at `/`, every other one under its prefix. `proxy.ts` applies the pure `createLocaleRouting` from `i18n/routing`; links take their address from `localePath` in `i18n/paths`, never from a hand-written `/${locale}`. The 404 and error views get their texts and a ready system `TopBar` from `useSystemMessages`: Next passes them no params. Both are a `SystemPage` (top bar at every width, one message, no left column); `error.tsx` hands `retry` to `ErrorView` and logs nothing.
- `validateContent` reports broken content with the path of each field. The first `getContent` call of a build runs it, so broken content fails the build.

## Theme

- `theme/theme.ts` holds both palettes; `buildThemeCss` turns them into CSS variables in the root layout. Components use `var(--token)` and the SCSS tokens of `styles/abstracts` (`$font-*`, `$dur-*`, `$delay-*`, `$ease-*`, `$z-*`, `$radius-*`, the breakpoint mixins); Stylelint rejects raw colours, z-indexes, radii, font families, durations, delays and easings. Only `src/app/`, `src/components/social/` and `src/guards/` import `theme/`.
- The theme lives in `data-theme` on `<html>`: the inline pre-paint script sets it from storage, `themeStore` changes it later. A component shows a per-theme part through CSS (`:global(:root[data-theme="light"])`), never by reading the mode while rendering.
- Storage goes through `utils/storage`: a blocked storage keeps the feature working for the visit.

## Page

- `app/[locale]/page.tsx` wraps `Hero` and the sections in `Shell`: the skip link, the background, the left column from 1024 pixels, the top bar below that width, `main` and the footer.
- The sections come from `site.sections` in `content/site.ts`, in that order, through `SECTIONS` in `components/sections/registry.ts`; its type demands a component for every id of `SECTION_IDS`.
- A section is a server component in `components/sections/<Name>/` with the signature `({ content }: { content: Content }) => ReactNode`. It picks its own slice of the content and wraps itself in `Section`, whose label is the section's `h2`; its id is its key in `SECTION_IDS` and the address `#<id>`. `Skills` is a band without a label and renders its own `section`.
- The blocks of the first screen rise into place with the `rise($step)` mixin (a module that uses it includes `rise-keyframes` once); delays come from `$delay-first` and `$delay-step`, and Stylelint rejects a raw delay. Under reduced motion nothing moves: the skills marquee becomes a wrapped list.
- The footer's pause sets `data-motion="off"` on `<html>` through `motionStore`, and the pre-paint script restores it from storage. A component that moves by itself owns its paused look in its own module through `:global(:root[data-motion="off"])`: a drifting part keeps its place (`animation-play-state: paused`), a blinking one rests lit (`animation: none`). Paused dialogs open without their entry; the pause leaves pointer effects, scrolling and the rise of the first screen alone; `useMotionPaused` is true while paused or under reduced motion.
- Pointer effects (the light, the custom cursor, `data-magnetic` buttons, `data-tilt` cards) run only while `usePointerEffects` is true: a hovering fine pointer, no reduced motion, forced colours or increased contrast. `PointerEffects` then imports `PointerLayer`, the only place that imports `motion`, on the first move of the mouse; a touch device never downloads it, and the system cursor stays until the ring is there. The layers are fixed to the window and move only through `transform`; the cursor layer is a `popover="manual"` that `Dialog` raises again after every `showModal()` through `topLayer`. Springs and sizes live in `constants/motion`.
- Blocks out of view at load wait under `data-reveal` and rise once they scroll in (`Reveal`); without the `js` class or under reduced motion nothing waits. The theme switch grows the new theme in a circle from the button through `runThemeTransition`, and applies at once without view transitions or under reduced motion.
- An overlay is `Dialog` on the native `<dialog>`: `showModal()` brings Escape, the focus trap and the return of focus. The image viewer is a `ViewerRoot` with `ViewerTrigger` buttons inside it, so the section around them stays a server component and builds the viewer's labels with `toViewerLabels`; an image without a file in `public/` is drawn as a `Placeholder`.
- Head tags come only from `utils/metadata`: `buildMetadata` in the layout's `generateMetadata`, `buildNotFoundMetadata` on the 404 page, which clears the canonical, the alternates and the previews. A child's `openGraph` replaces the parent's whole object, so no other segment writes one. Every absolute address resolves against `SITE_URL` from `config/site` (`NEXT_PUBLIC_SITE_URL`, an origin only, required by a production build); the page renders the structured data through `JsonLd`, which escapes `<`.
- The link preview is `app/social/[file]/route.tsx`: one `<locale>.png` per language drawn at build time by `next/og` from `SocialCard` (inline styles, flexbox, the static fonts of `theme/fonts/`); the renderer knows no `color-mix()`, so a tint goes through `withAlpha`. Metadata and JSON-LD point at it through `socialImagePath`, with the version in the address.
- The name is the only `h1`. It exists twice, in the left column and in the hero, and CSS displays exactly one at every width.
- The language links are plain links from `localePath`, so they work without JavaScript; the current one carries `aria-current="page"`. Once hydrated, `localeHref` adds the section being read.
- The section being read comes from `activeSectionStore`, with observers and no scroll listener: the topmost section in a band just above the middle of the window, the last one once it is in full view (the end of the page). A chosen `SectionNav` link marks its section at once and holds it until the reader scrolls again (wheel, touch, a scrolling key, the scrollbar); a click with a modifier is left to the browser. `SectionNav` (left column and menu sheet) marks it with `aria-current="location"`; the items come from `buildNavItems`, so a section without a `nav` label stays out. Below 1024 pixels the top bar sticks and `html` keeps `scroll-padding-top` for it; an open menu sheet closes once the window is wide enough for the left column.
- The security headers live in `next.config.ts`, the same on every response of a build. Something blocked by the content security policy gets its one directive widened, with the reason in the README's Security section; `e2e/security.spec.ts` holds the exact values.
- A control that works only through its island (theme, menu, copy, pause) is hidden without the `js` class and keeps its place but stays invisible until hydrated (`useHydrated`, the `waits-for-hydration` mixin), so it never shows a click that does nothing.

## Recipes

- **A section.** Add its id to `SECTION_IDS` in `constants/sections.ts`; its texts to a new file in `content/`, added to `source` in `content/index.ts` under the section's id; its type, extending `SectionMeta` (`label`, and `nav` - `null` keeps it out of the navigation), to `ContentSource` in `types/content.ts`, and its slice to the fixture in `test/fixtures/content`; the component to `components/sections/<Name>/` and to `SECTIONS`; then list the id in `site.sections`. The type of `SECTIONS` fails until the component is there.
- **A language.** Add it to `LOCALES` and `LOCALE_META` in `content/locales.ts`; the type check then lists every `Localized` field still missing it. Add its letters to `UNICODES` in `scripts/web-fonts.mjs` and build the web fonts again; the static fonts of `theme/fonts/` must cover its alphabet too, as they draw the previews. Routing, metadata, the sitemap, the previews and the tests follow `LOCALES` by themselves.
- **A field.** Add it to the type in `types/content.ts`, the value to its `content/` file and to the fixture; a field with markup also goes to `richFields` in `i18n/fields.ts`, a link, file, month, period or refs object to `linkFields`, `fileFields`, `monthFields`, `periodFields` or `refsFields`, so `validateContent` checks it. The component reads it from its `content` slice.

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

Production is the `Dockerfile` image: the standalone server as user `node` on port 8080, `/health` answers `ok`, `NEXT_PUBLIC_SITE_URL` is a build argument. A `v*` tag equal to the version in `package.json` runs `.github/workflows/deploy.yml`, which rolls the image out through `deploy/deploy.sh`; the CI job `image` builds and probes it on every pull request.

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
