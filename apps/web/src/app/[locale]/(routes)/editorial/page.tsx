import { Suspense } from "react";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { PDPSkeleton } from "@/components/product/PDPSkeleton";
import { createEditorialService } from "@/server/services/editorial.service";

export const dynamic = "force-dynamic";

async function EditorialGrid() {
  const editorialService = createEditorialService();
  const editorials = await editorialService.listAll();

  if (editorials.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-obsidian-500">No articles published yet. Check back soon.</p>
      </div>
    );
  }

  const featured = editorials.find((e) => e.featured) ?? editorials[0];
  const rest = editorials.filter((e) => e.id !== featured.id);

  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Featured Story: Asymmetric span */}
      <div className="md:col-span-8">
        <ArticleCard article={featured} featured />
      </div>
      {/* Secondary Stories: Stacked */}
      <div className="md:col-span-4 flex flex-col gap-8">
        {rest.slice(0, 2).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      {/* Remaining Stories: Full width grid */}
      <div className="md:col-span-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.slice(2).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}

export default function EditorialIndexPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">
          The Journal
        </span>
        <h1 className="mt-2 text-4xl font-display font-medium text-obsidian-900 sm:text-5xl">
          Curated Narratives
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-obsidian-600">
          Exploring the intersection of craftsmanship, design, and conscious luxury.
        </p>
      </header>
      <Suspense fallback={<PDPSkeleton />}>
        <EditorialGrid />
      </Suspense>
    </main>
  );
}
