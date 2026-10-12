// a thin band just above the middle of the window: the section crossing it is the one being read
export const ACTIVE_SECTION_MARGIN = "-40% 0px -55% 0px";
// the last section this much in view means the page is at its end; a rounding pixel keeps it under 1
export const END_VISIBLE_RATIO = 0.99;
// keys that scroll the page; one of them ends the hold a chosen link put on its section
export const SCROLL_KEYS: readonly string[] = [
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
];

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
