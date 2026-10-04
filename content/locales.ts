export const LOCALES = ["en", "pl", "uk"] as const;

export const DEFAULT_LOCALE = "en" satisfies (typeof LOCALES)[number];

// label: the badge in the language switcher; name: the language in itself; openGraph: the og:locale code
export const LOCALE_META = {
    en: { label: "EN", name: "English", openGraph: "en_US" },
    pl: { label: "PL", name: "Polski", openGraph: "pl_PL" },
    uk: { label: "UA", name: "Українська", openGraph: "uk_UA" },
} as const satisfies Record<
    (typeof LOCALES)[number],
    { label: string; name: string; openGraph: string }
>;
