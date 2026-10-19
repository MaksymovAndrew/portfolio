import localFont from "next/font/local";

// one file per family with every language's letters and only the weights the styles use (scripts/web-fonts.mjs); the first screen sets all three, so all three are preloaded

// headings and the name
export const display = localFont({
    src: "./fonts/web/Unbounded.woff2",
    weight: "600 700",
    display: "swap",
    preload: true,
    variable: "--font-display",
});

// running text
export const body = localFont({
    src: "./fonts/web/Manrope.woff2",
    weight: "400 700",
    display: "swap",
    preload: true,
    variable: "--font-body",
});

// labels, the terminal, small print
export const mono = localFont({
    src: "./fonts/web/JetBrainsMono.woff2",
    weight: "400 500",
    display: "swap",
    preload: true,
    variable: "--font-mono",
});
