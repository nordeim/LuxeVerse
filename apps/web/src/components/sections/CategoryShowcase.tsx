import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Outerwear", slug: "outerwear", image: "/categories/outerwear.jpg" },
  { name: "Tailoring", slug: "tailoring", image: "/categories/tailoring.jpg" },
  { name: "Accessories", slug: "accessories", image: "/categories/accessories.jpg" },
];

export function CategoryShowcase() {
  return (
    <section className="bg-obsidian-50 py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="categories-heading" className="mb-12 text-3xl font-display font-medium text-obsidian-900">Shop by Category</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/shop/${cat.slug}`} className="group relative aspect-square overflow-hidden rounded-xl bg-obsidian-100">
              <Image src={cat.image} alt={cat.name} width={600} height={600} className="h-full w-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-obsidian-950/50 to-transparent">
                <span className="text-xl font-display font-medium text-white">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
