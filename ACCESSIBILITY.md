# Accessibility

The site aims to meet the [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) at level AA, in every language and in both themes.

## What is supported

- **Keyboard.** Everything works without a mouse, in reading order. A skip link leads past the navigation to the content. Dialogs - the image viewer and the phone menu - are native dialogs: focus stays inside while they are open, Escape closes them and focus returns to the button that opened them.
- **Visible focus.** Every control shows a 2-pixel ring in the accent colour when it receives keyboard focus.
- **Contrast.** Every text colour reaches at least 4.5:1 on its backgrounds, in the dark and the light theme. A test computes these ratios from the palettes, so a colour change that breaks one fails the checks.
- **Targets.** Buttons and standalone links are at least 24 by 24 pixels; links inside a sentence follow the text.
- **Structure.** One main heading, section headings without skipped levels, landmarks for the header, navigation, main content and footer. The language links carry the language of their label, and every page declares its own.
- **Names and announcements.** Icon buttons have text names; decoration such as the background and the typing terminal is hidden from assistive technology. Copying the email address is announced, and the image viewer announces its caption as the image changes.
- **Reduced motion.** With "reduce motion" turned on in the system, nothing moves: the skills become a static list, blocks appear without rising, the theme changes at once and the pointer effects stay off.
- **A pause button.** The footer's pause stops everything that moves by itself - the drifting background, the skills, the terminal, the blinking dots - and the site remembers the choice.
- **High contrast.** With forced colours or a request for more contrast, the pointer light and the custom cursor stay off and the system cursor remains.
- **Without JavaScript.** The whole page is readable, its anchors and language links work, and the default theme applies.
- **Zoom and small screens.** The page reflows from 320 pixels wide and at 200% zoom without scrolling sideways.

## How it is tested

- **Automated rules on every change.** The browser tests run axe with the WCAG 2.2 A and AA rules on the home and the 404 page of every language, in both themes, at a phone (375 pixels) and a desktop (1440 pixels) width; on the paused home page at every width from 320 to 1440 pixels; and with the image viewer open.
- **Behaviour in the browser.** The same tests check the skip link, the dialogs and the return of focus, the pause button, reduced motion, the page without JavaScript and the absence of sideways scrolling.
- **Lighthouse.** Every pull request must reach an accessibility score of at least 0.95 on every language.
- **Contrast.** A unit test checks every text colour of both palettes.
- **By hand.** Keyboard walks, 200% zoom and reduced motion are checked before a release.

## Known limits

- Automated checks find only part of the possible problems; how a screen reader speaks the page is not covered by them.
- The short rise of the first screen plays once on load even when the pause is on; only the system's reduced-motion setting skips it.
- Older browsers may lose a visual effect, such as the theme circle or the language fade, but never content.

## Reporting a problem

If something on the site is hard or impossible to use, please [open an issue](https://github.com/MaksymovAndrew/portfolio/issues/new) describing the page, the browser and any assistive technology you use, or write to the email address on the site.
