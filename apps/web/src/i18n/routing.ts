import { createNavigation } from "next-intl/navigation";

// MEP §4.3 — Locale setup aligned with src/i18n/config.ts
export const locales = ["en", "fr", "ar"] as const;
export const defaultLocale: (typeof locales)[number] = "en";

export type Locale = (typeof locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation<
  typeof locales
>({
  locales,
  defaultLocale,
});
