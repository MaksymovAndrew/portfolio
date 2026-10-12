// characters the framework places between pieces of content; they are punctuation, not words
export const GLYPHS = {
    separator: "·",
    range: "-",
    // between the place of an image and the count: "2 / 3"
    counter: "/",
    // the terminal's prompt and home folder
    prompt: "➜",
    home: "~",
    // the clock before the browser knows the time
    clock: "--:--",
} as const;
