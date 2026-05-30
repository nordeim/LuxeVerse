import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuxeVerse | Cinematic Luxury Commerce",
  description:
    "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
};

// Root layout: must NOT render <html> or <body> when [locale]/layout.tsx handles them.
// Rendering both causes a hydration mismatch because Next.js sees conflicting attributes.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
