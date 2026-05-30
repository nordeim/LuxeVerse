"use client";

import { NextIntlClientProvider } from "next-intl";
import { TRPCProvider } from "@/trpc/provider";

interface ClientProvidersProps {
  locale: string;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * ClientProviders
 * Wraps children with both tRPC and next-intl client providers.
 * Must be a client component because both TRPCProvider and NextIntlClientProvider
 * rely on React Context.
 */
export function ClientProviders({
  locale,
  messages,
  children,
}: ClientProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TRPCProvider>{children}</TRPCProvider>
    </NextIntlClientProvider>
  );
}
