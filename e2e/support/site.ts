export { DEFAULT_LOCALE, LOCALES } from "content/locales";

export const WIDTHS = [320, 375, 768, 1024, 1280, 1440] as const;

export const VIEWPORT_HEIGHT = 900;

export const pathFor = (locale: string): string => `/${locale}`;
