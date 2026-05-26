import { routing } from "./routing";

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const messages = (await import(`../messages/${String(locale)}.json`)).default;
  return messages as Record<string, unknown>;
}

/**
 * Request-scoped i18n configuration for next-intl v4.
 *
 * This file is the target of the `next-intl/config` alias that the plugin
 * creates. It is consumed by Server Components (e.g. `getTranslations`,
 * `getLocale`) and by the `next-intl` plugin.
 *
 * Must export a factory built with `getRequestConfig` so the plugin can
 * resolve it at runtime. The file path is configured in `next.config.ts`.
 */
export default (async function ({
  requestLocale,
}: {
  requestLocale: Promise<string>;
}): Promise<{ locale: string; messages: Record<string, unknown> }> {
  const requested = await requestLocale;
  const locale: string =
    requested && routing.locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
