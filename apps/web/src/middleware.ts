import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/routing";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Match all paths except API routes, static files, and images
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
