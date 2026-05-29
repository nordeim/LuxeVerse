import { notFound } from "next/navigation";
import { createProductService } from "@/server/services/product.service";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { StickyAddToBar } from "@/components/product/StickyAddToBar";

export const dynamic = "force-dynamic";

interface PDPProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function ProductPage({ params }: PDPProps) {
  const { slug } = await params;

  const service = createProductService();
  const product = await service.getBySlug(slug);

  if (!product) notFound();

  const colorOptions = product.variants
    .filter((v) => v.color)
    .map((v) => ({
      id: v.id,
      name: v.name,
      value: v.color!,
      colorHex: v.colorHex,
      inventory: v.inventory,
    }));

  const sizeOptions = product.variants
    .filter((v) => v.size)
    .map((v) => ({
      id: v.id,
      name: v.name,
      value: v.size!,
      inventory: v.inventory,
    }));

  const primaryImage = product.images[0];

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery
            images={product.images.map((img) => ({
              url: img.url,
              altText: img.altText,
              width: img.width ?? 800,
              height: img.height ?? 1066,
            }))}
          />

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-display font-medium text-obsidian-900">
                {product.name}
              </h1>
              <PriceDisplay
                current={product.price}
                compareAt={product.compareAtPrice}
                currency="USD"
              />
            </div>

            <ProductActions
              productId={product.id}
              productName={product.name}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
              imageUrl={primaryImage?.url ?? null}
            />

            <div className="text-sm text-obsidian-700 leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>

        {/* StickyAddToBar is a Client Component that manages its own ref */}
        <StickyAddToBar
          productId={product.id}
          productName={product.name}
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          imageUrl={primaryImage?.url ?? null}
          onAddToCart={() => {}}
          isAdding={false}
        />
      </div>
    </main>
  );
}
