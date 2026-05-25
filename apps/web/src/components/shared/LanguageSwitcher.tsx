"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/routing";
import { useCallback } from "react";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname (e.g., /en/shop → en)
  const currentLocale = pathname.split("/")[1] ?? "en";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = e.target.value;
      // Replace the locale in the pathname
      const newPathname = pathname.replace(
        /^\/${currentLocale}(\/|$)/,
        `/${newLocale}$1`
      );
      router.push(newPathname);
    },
    [currentLocale, pathname, router]
  );

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="bg-transparent border border-input rounded-md px-2 py-1 text-sm focus-visible:outline-hidden focus-visible:ring-1"
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale === "en" ? "English" : locale === "fr" ? "Français" : locale}
        </option>
      ))}
    </select>
  );
}
