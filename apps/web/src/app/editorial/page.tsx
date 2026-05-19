import { Suspense } from "react";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { PDPSkeleton } from "@/components/product/PDPSkeleton";

// Mock data. In production: await prisma.editorial.findMany...
const EDITORIALS = [
  { id: "1", slug: "architecture-of-silence", category: "Design", title: "The Architecture of Silence", excerpt: "How negative space defines luxury in the digital age.", cover: "/editorial/1.jpg", author: "Elena Voss", readTime: 6, featured: true },
  { id: "2", slug: "merino-revolution", category: "Materials", title: "The Merino Revolution", excerpt: "Why superfine wool is replacing synthetic performance fabrics.", cover: "/editorial/2.jpg", author: "Marcus Chen", readTime: 4, featured: false },
  { id: "3", slug: "color-theory-2026", category: "Trends", title: "Color Theory 2026", excerpt: "Moving beyond safe neutrals into atmospheric depth.", cover: "/editorial/3.jpg", author: "Sofia Rossi", readTime: 5, featured: false },
  { id: "4", slug: "craftsmanship-digital", category: "Heritage", title: "Craftsmanship in Code", excerpt: "Translating atelier precision to pixel-perfect interfaces.", cover: "/editorial/4.jpg", author: "Julian Hayes", readTime: 7, featured: false },
];

function EditorialGrid() {
  const featured = EDITORIALS.find((e) => e.featured)!;
  const rest = EDITORIALS.filter((e) => !e.featured);

  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Featured Story: Asymmetric span */}
      <div className="md:col-span-8">
        <ArticleCard article={featured} featured />
      </div>
      {/* Secondary Stories: Stacked */}
      <div className="md:col-span-4 flex flex-col gap-8">
        {rest.slice(0, 2).map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
      {/* Remaining Stories: Full width grid */}
      <div className="md:col-span-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.slice(2).map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}

export default function EditorialIndexPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">The Journal</span>
        <h1 className="mt-2 text-4xl font-display font-medium text-obsidian-900 sm:text-5xl">Curated Narratives</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-obsidian-600">Exploring the intersection of craftsmanship, design, and conscious luxury.</p>
      </header>
      <Suspense fallback={<PDPSkeleton />}>
        <EditorialGrid />
      </Suspense>
    </main>
  );
}
