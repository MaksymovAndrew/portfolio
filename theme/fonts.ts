import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";

// every alphabet is declared and a page fetches only what its text needs; the first screen sets all three in Latin, so those files are preloaded, and the running text's Cyrillic too: arriving late, it reflows the Ukrainian first screen

// headings and the name
export const display = Unbounded({
    display: "swap",
    preload: true,
    subsets: ["latin"],
    variable: "--font-display",
});

// running text
export const body = Manrope({
    display: "swap",
    preload: true,
    subsets: ["latin", "cyrillic"],
    variable: "--font-body",
});

// labels, the terminal, small print
export const mono = JetBrains_Mono({
    display: "swap",
    preload: true,
    subsets: ["latin"],
    variable: "--font-mono",
});
