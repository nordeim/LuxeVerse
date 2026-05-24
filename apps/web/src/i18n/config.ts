/**
 * i18n Configuration (MEP §4.3)
 *
 * Centralized locale setup for next-intl v4.
 * Used by routing, middleware, and locale-aware layouts.
 */

export const locales = ["en", "fr", "ar"] as const;
export const defaultLocale: (typeof locales)[number] = "en";

export type Locale = (typeof locales)[number];

/**
 * RTL locale detection for dir="rtl" logic
 */
export const rtlLocales: readonly string[] = ["ar"];

export function isRTL(locale: string): boolean {
  return rtlLocales.includes(locale);
}
