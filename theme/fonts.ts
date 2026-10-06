import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";

// every alphabet is declared and a page fetches only what its text needs; the first screen of every page sets all three in Latin, so those files are preloaded

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
    subsets: ["latin"],
    variable: "--font-body",
});

// labels, the terminal, small print
export const mono = JetBrains_Mono({
    display: "swap",
    preload: true,
    subsets: ["latin"],
    variable: "--font-mono",
});
