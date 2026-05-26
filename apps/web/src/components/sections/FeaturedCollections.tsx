import Image from "next/image";
import Link from "next/link";
import { cn } from "@luxeverse/utils";
import { createFeaturedCollectionsService } from "@/server/services/featuredCollections.service";

export async function FeaturedCollections() {
  const service = createFeaturedCollectionsService();
  const collections = await service.list();

  if (collections.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-obsidian-50 py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="featured-collections-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="featured-collections-heading"
          className="mb-12 text-center text-3xl font-display font-medium text-obsidian-900 sm:text-4xl"
        >
          Curated Collections
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl bg-obsidian-100",
                idx === 1 ? "md:-mt-12 md:mb-12" : "" // Asymmetric editorial offset
              )}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={col.image ?? "/placeholder-collection.jpg"}
                  alt={col.name}
                  width={600}
                  height={750}
                  className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-obsidian-950/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-display font-medium">{col.name}</h3>
                <p className="mt-1 text-sm text-obsidian-100/80">
                  {col.productCount} Pieces
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
