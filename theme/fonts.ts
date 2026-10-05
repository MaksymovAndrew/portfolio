import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";

// no preload: every alphabet is declared, a page fetches only what its text needs, and preloads took bandwidth from the first paint on a slow phone

// headings and the name
export const display = Unbounded({
    display: "swap",
    preload: false,
    variable: "--font-display",
});

// running text
export const body = Manrope({
    display: "swap",
    preload: false,
    variable: "--font-body",
});

// labels, the terminal, small print
export const mono = JetBrains_Mono({
    display: "swap",
    preload: false,
    variable: "--font-mono",
});
