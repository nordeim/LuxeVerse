import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

/**
 * Routing configuration for next-intl v4.
 *
 * Consumed by the middleware (`createMiddleware`) and the NextIntlClientProvider.
 * Must be separate from the request configuration (`request.ts`)
 * because routing config is used for locale URL parsing and redirections,
 * while request config handles per-request message loading.
 */
const routing = defineRouting({
  // Cast to string[] to avoid readonly tuple incompatibility with defineRouting
  locales: locales as unknown as string[],
  defaultLocale: defaultLocale,
  localePrefix: "always",
});

export { routing, locales, defaultLocale };
export type { Locale } from "./config";
export type Routing = typeof routing;

export default routing;
