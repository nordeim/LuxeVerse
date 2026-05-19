import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/types";
import { Badge } from "@luxeverse/ui";
import { formatCurrency } from "@/lib/utils";
import { QuickAddButton } from "./QuickAddButton";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps): ReactElement {
  return (
    <article className="group relative flex flex-col gap-3">
      <Link href={`/shop/outerwear/${product.slug}`} className="relative aspect-product overflow-hidden rounded-lg bg-obsidian-100 block">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-300 ease-luxe group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-obsidian-200" aria-hidden="true" />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="new">New</Badge>
        </div>
      </Link>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-base font-medium text-obsidian-900 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-obsidian-900">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-obsidian-500 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
      <QuickAddButton productId={product.id} />
    </article>
  );
}
