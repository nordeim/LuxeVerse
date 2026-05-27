import { createFeaturedCollectionsService } from "@/server/services/featuredCollections.service";
import { createNewArrivalsService } from "@/server/services/newArrivals.service";
import { createEditorialService } from "@/server/services/editorial.service";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { CollectionSpread } from "@/components/sections/CollectionSpread";
import { ProductScroll } from "@/components/sections/ProductScroll";
import { AIStylistSection } from "@/components/sections/AIStylistSection";
import { CraftsmanshipSection } from "@/components/sections/CraftsmanshipSection";
import { SustainabilityMetrics } from "@/components/sections/SustainabilityMetrics";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch data from real services
  const [featuredCollections, newArrivals, editorials] = await Promise.all([
    createFeaturedCollectionsService().list().catch(() => []),
    createNewArrivalsService().list().catch(() => []),
    createEditorialService().listFeatured().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-50">
      {/* Hero: Full-screen cinematic dark */}
      <HeroSection locale={locale} />

      {/* Marquee band */}
      <MarqueeBand locale={locale} />

      {/* Collections: Editorial spreads */}
      <CollectionSpread
        collections={featuredCollections.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description ?? null,
          image: c.image ?? null,
          season: "AW25",
        }))}
        locale={locale}
      />

      {/* New Arrivals: Horizontal scroll */}
      <ProductScroll
        products={newArrivals.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: p.image ?? null,
          category: p.category,
        }))}
        locale={locale}
      />

      {/* AI Stylist: Split-pane feature */}
      <AIStylistSection locale={locale} />

      {/* Craftsmanship: Full-width narrative */}
      <CraftsmanshipSection locale={locale} />

      {/* Sustainability: Metric counters */}
      <SustainabilityMetrics locale={locale} />

      {/* Editorial: Article cards */}
      <EditorialSection
        articles={editorials.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          excerpt: e.excerpt ?? null,
          coverImage: e.coverImage ?? null,
          category: e.category,
        }))}
        locale={locale}
      />

      {/* Newsletter */}
      <NewsletterSignup locale={locale} />

      {/* Footer */}
      <Footer locale={locale} />
    </div>
  );
}
