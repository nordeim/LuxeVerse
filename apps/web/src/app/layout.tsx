import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuxeVerse | Cinematic Luxury Commerce",
  description:
    "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
