import { createFeaturedCollectionsService } from "@/server/services/featuredCollections.service";
import { createNewArrivalsService } from "@/server/services/newArrivals.service";
import { createEditorialService } from "@/server/services/editorial.service";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch data from real services
  const [featuredCollections, newArrivals, editorials] = await Promise.all([
    createFeaturedCollectionsService().list().catch(() => []),
    createNewArrivalsService().list().catch(() => []),
    createEditorialService().listFeatured().catch(() => []),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-2xl bg-obsidian-900 text-obsidian-50">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 px-8 py-24 text-center sm:px-16 sm:py-32">
          <h1 className="mb-6 text-4xl font-display font-bold tracking-tight sm:text-6xl">
            {locale === "fr" ? "Bienvenue à LuxeVerse" : "Welcome to LuxeVerse"}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-obsidian-200 sm:text-xl">
            {locale === "fr"
              ? "Commerce de luxe cinématique avec expériences immersives et personnalisation IA."
              : "Cinematic luxury commerce with immersive experiences and AI-driven personalization."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-lg bg-metallic-gold px-6 py-3 font-medium text-obsidian-900 transition-colors hover:bg-metallic-champagne"
            >
              {locale === "fr" ? "Explorer la Boutique" : "Explore the Shop"}
            </Link>
            <Link
              href="/editorial"
              className="rounded-lg border border-obsidian-200 px-6 py-3 font-medium text-obsidian-50 transition-colors hover:bg-obsidian-800"
            >
              {locale === "fr" ? "Lire l'Editorial" : "Read Editorial"}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">
              {locale === "fr" ? "Collections en Vedette" : "Featured Collections"}
            </h2>
            <Link href="/shop" className="text-sm font-medium text-neon-cyan hover:underline">
              {locale === "fr" ? "Voir Tout →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/shop/${collection.slug}`}
                className="group overflow-hidden rounded-xl border border-obsidian-200 bg-obsidian-50 transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={collection.image ?? "/images/placeholder-collection.png"}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold">{collection.name}</h3>
                  <p className="mt-1 text-sm text-obsidian-600">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">
              {locale === "fr" ? "Nouveautés" : "New Arrivals"}
            </h2>
            <Link href="/shop" className="text-sm font-medium text-neon-cyan hover:underline">
              {locale === "fr" ? "Voir Tout →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.category}/${product.slug}`}
                className="group rounded-xl border border-obsidian-200 bg-obsidian-50 p-3 transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={product.image ?? "/images/placeholder-product.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-obsidian-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Editorial */}
      {editorials.length > 0 && (
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">
              {locale === "fr" ? "Editorial" : "Editorial"}
            </h2>
            <Link href="/editorial" className="text-sm font-medium text-neon-cyan hover:underline">
              {locale === "fr" ? "Voir Tout →" : "View All →"}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {editorials.map((article) => (
              <Link
                key={article.id}
                href={`/editorial/${article.slug}`}
                className="group overflow-hidden rounded-xl border border-obsidian-200 bg-obsidian-50 transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={article.coverImage ?? "/images/placeholder-editorial.png"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold">{article.title}</h3>
                  <p className="mt-1 text-sm text-obsidian-600 line-clamp-2">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="mb-16 rounded-2xl bg-obsidian-900 px-8 py-16 text-center text-obsidian-50">
        <h2 className="mb-4 text-2xl font-display font-bold">
          {locale === "fr" ? "Restez Informé" : "Stay Informed"}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-obsidian-200">
          {locale === "fr"
            ? "Abonnez-vous à notre newsletter pour les dernières collections et histoires exclusives."
            : "Subscribe to our newsletter for the latest collections and exclusive stories."}
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder={locale === "fr" ? "Votre email" : "Your email"}
            className="flex-1 rounded-lg border border-obsidian-700 bg-obsidian-800 px-4 py-3 text-obsidian-50 placeholder:text-obsidian-400"
          />
          <button className="rounded-lg bg-metallic-gold px-6 py-3 font-medium text-obsidian-900 transition-colors hover:bg-metallic-champagne">
            {locale === "fr" ? "S'abonner" : "Subscribe"}
          </button>
        </div>
      </section>

      {/* Language Switcher (footer area) */}
      <div className="flex items-center justify-center gap-4 border-t border-obsidian-200 pt-8">
        <span className="text-sm text-obsidian-500">Language:</span>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
