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

// pointer effects only where a mouse or a trackpad hovers; the last two keep the system cursor for those who rely on its size and contrast
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
export const FORCED_COLORS_QUERY = "(forced-colors: active)";
export const MORE_CONTRAST_QUERY = "(prefers-contrast: more)";

// stiffness / damping with mass 1
export const SPRINGS = {
    spot: { stiffness: 110, damping: 21 },
    ring: { stiffness: 380, damping: 30 },
    ringScale: { stiffness: 300, damping: 24 },
    magnet: { stiffness: 240, damping: 16 },
    tilt: { stiffness: 200, damping: 22 },
} as const;

// the zone around a magnetic element in px, the share of the distance it follows and its reach
export const MAGNET = { zone: 36, strength: 0.28, maxX: 12, maxY: 10 } as const;

// the full swing in degrees from one edge to the other, the lift in px
export const TILT = {
    rotateX: 3.2,
    rotateY: 4.4,
    lift: 4,
    perspective: 900,
} as const;

export const CURSOR = { hotScale: 1.5, pressedScale: 0.8 } as const;

export const REVEAL = {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.08,
} as const;
