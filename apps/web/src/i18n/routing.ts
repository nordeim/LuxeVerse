import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "fr"] as const;
export const defaultLocale: (typeof locales)[number] = "en";

export type Locale = (typeof locales)[number];

export const { Link, redirect, usePathname, useRouter } = createNavigation<
  typeof locales
>({
  locales,
  defaultLocale,
});
