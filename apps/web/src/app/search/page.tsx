import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { FacetFilter } from "@/components/search/FacetFilter";
import { createProductService } from "@/server/services/product.service";

// Mock facets. In production: generated dynamically from aggregation pipeline
const FACETS = [
  { name: "color", label: "Color", options: [
    { value: "black", label: "Obsidian", count: 42 },
    { value: "gold", label: "Champagne", count: 18 },
    { value: "silver", label: "Metallic", count: 24 },
  ]},
  { name: "size", label: "Size", options: [
    { value: "xs", label: "XS", count: 12 },
    { value: "s", label: "S", count: 28 },
    { value: "m", label: "M", count: 35 },
    { value: "l", label: "L", count: 20 },
  ]},
];

async function SearchResults() {
  const service = createProductService();

  // In production: map searchParams to service filters & execute parallel fetch
  const products = await service.list({ limit: 12 });

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-xl font-display text-obsidian-900">No results found</h3>
        <p className="text-sm text-obsidian-600 max-w-md">We couldn&apos;t find anything matching your search. Try adjusting your filters or explore our curated collections.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24 space-y-2">
          <h2 className="mb-4 text-sm font-mono font-medium tracking-widest uppercase text-obsidian-500">Filters</h2>
          {FACETS.map((facet) => (
            <FacetFilter key={facet.name} name={facet.name} label={facet.label} options={facet.options} />
          ))}
        </div>
      </aside>
      <div className="lg:col-span-3">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-obsidian-600">{products.length} results</p>
          <select className="rounded-md border border-obsidian-200 bg-obsidian-50 px-3 py-1.5 text-sm text-obsidian-700 focus:ring-2 focus:ring-neon-cyan">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="sr-only">Search results</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
