import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import { SkipLink } from "@/components/shared/SkipLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxeVerse | Cinematic Luxury Commerce",
  description:
    "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
  openGraph: {
    title: "LuxeVerse | Cinematic Luxury Commerce",
    description:
      "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
    type: "website",
    images: [{ url: "/og-image.jpg", alt: "LuxeVerse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeVerse | Cinematic Luxury Commerce",
    description:
      "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="bg-obsidian-50 text-obsidian-900 antialiased">
        <SkipLink />
        <ErrorBoundary>
          <Navbar />
          <main id="main-content" className="min-h-screen pt-[var(--navbar-height)]">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
