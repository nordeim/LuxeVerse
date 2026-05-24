import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-display font-bold">
          {locale === "fr" ? "Bienvenue à LuxeVerse" : "Welcome to LuxeVerse"}
        </h1>
        <LanguageSwitcher />
      </div>
      <p className="text-lg text-muted-foreground">
        {locale === "fr"
          ? "Commerce de luxe cinématique avec expériences immersives."
          : "Cinematic luxury commerce with immersive experiences."}
      </p>
    </div>
  );
}
