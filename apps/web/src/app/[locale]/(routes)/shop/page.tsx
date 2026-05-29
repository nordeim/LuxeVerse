import { createProductService } from "@/server/services/product.service";
import { Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export const revalidate = 60;
export const dynamic = "force-dynamic";

// Next.js 16: params is a real Promise, always await it.
interface ShopPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const _params = await params; // Next.js 16: params is a real Promise, always await it
  void _params.locale; // available for i18n data fetching

  const service = createProductService();
  const products = await service.list({ limit: 12 });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-display font-medium text-obsidian-900">
        Shop All
      </h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Suspense>
    </main>
  );
}
