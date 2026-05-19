import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedCollections } from "@/components/sections/FeaturedCollections";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { EditorialHighlight } from "@/components/sections/EditorialHighlight";
import { BrandStory } from "@/components/sections/BrandStory";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { SocialProof } from "@/components/sections/SocialProof";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LuxeVerse | Cinematic Luxury Commerce",
  description: "Where cinematic storytelling meets intelligent commerce. Discover curated collections, AI-powered styling, and immersive product experiences.",
  openGraph: {
    title: "LuxeVerse | Cinematic Luxury Commerce",
    description: "Redefining luxury commerce through cinematic experiences and intelligent personalization.",
    images: ["/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-0">
      {/* Hero: Client Island for video/animation */}
      <HeroSection />

      {/* Featured Collections: RSC */}
      <Suspense fallback={<div className="h-64 bg-obsidian-100 animate-pulse" />}>
        <FeaturedCollections />
      </Suspense>

      {/* New Arrivals: Client Island for carousel */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <NewArrivals />
      </Suspense>

      {/* Editorial Highlight: RSC */}
      <Suspense fallback={<div className="h-96 bg-obsidian-100 animate-pulse" />}>
        <EditorialHighlight />
      </Suspense>

      {/* Brand Story: Client Island for parallax */}
      <BrandStory />

      {/* Category Showcase: RSC */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <CategoryShowcase />
      </Suspense>

      {/* Social Proof: RSC */}
      <SocialProof />

      {/* Newsletter: Client Island for form */}
      <NewsletterSection />
    </main>
  );
}
