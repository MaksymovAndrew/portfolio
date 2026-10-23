// characters the framework places between pieces of content; they are punctuation, not words
export const GLYPHS = {
    separator: "·",
    range: "-",
    // between the place of an image and the count: "2 / 3"
    counter: "/",
    // before a label where CSS cannot draw it, as on the preview card
    comment: "//",
    // the terminal's home folder
    home: "~",
    // the clock before the browser knows the time
    clock: "--:--",
} as const;
