import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export default function LoadingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-obsidian-200" aria-busy="true" aria-label="Loading..." />
      <ProductGridSkeleton />
    </div>
  );
}
