import { locales, defaultLocale } from "./i18n/config";

/**
 * next-intl v4 configuration file for App Router auto-discovery.
 *
 * next-intl@4+ expects a configuration file at the project root
 * (or configured path) to resolve locale settings, message loading,
 * and routing configuration for the App Router integration.
 *
 * This file serves as the single source of truth for next-intl's
 * middleware and server-side rendering.
 *
 * @see https://next-intl.dev/docs/getting-started/app-router
 */
export default {
  locales,
  defaultLocale,
  localePrefix: "always",
} as const;
