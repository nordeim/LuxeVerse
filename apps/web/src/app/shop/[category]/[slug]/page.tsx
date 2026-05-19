import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { createProductService } from "@/server/services/product.service";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { StickyAddToBar } from "@/components/product/StickyAddToBar";
import { Button } from "@luxeverse/ui";

interface PDPProps {
  params: { category: string; slug: string };
}

export default async function ProductPage({ params }: PDPProps): Promise<ReactElement> {
  const { slug } = params;

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

            {colorOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-obsidian-700">Color</span>
                <VariantSelector
                  type="color"
                  options={colorOptions}
                  selectedId={null}
                  onSelect={() => {}}
                />
              </div>
            )}

            {sizeOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-obsidian-700">Size</span>
                <VariantSelector
                  type="size"
                  options={sizeOptions}
                  selectedId={null}
                  onSelect={() => {}}
                />
              </div>
            )}

            <Button variant="luxury" size="lg" className="w-full">
              Add to Bag
            </Button>

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
