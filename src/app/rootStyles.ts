import { body, display, mono } from "theme/fonts";
import { theme } from "theme/theme";

import { buildThemeCss } from "utils/buildThemeCss";

// shared by the root document and the global error page, which draws its own document in the browser
export const THEME_CSS = buildThemeCss(theme);

export const FONT_VARIABLES = [
    display.variable,
    body.variable,
    mono.variable,
].join(" ");
