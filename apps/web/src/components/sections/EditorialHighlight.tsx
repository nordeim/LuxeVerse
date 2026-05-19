import Image from "next/image";
import Link from "next/link";

export function EditorialHighlight() {
  return (
    <section className="bg-obsidian-950 py-24 px-4 sm:px-6 lg:px-8 text-obsidian-50" aria-labelledby="editorial-heading">
      <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-obsidian-900">
          <Image src="/editorial/hero.jpg" alt="Editorial feature" width={800} height={1000} className="h-full w-full object-cover" priority />
        </div>
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">Editorial</span>
          <h2 id="editorial-heading" className="text-4xl font-display font-light leading-tight">
            The Architecture of Silence
          </h2>
          <p className="text-lg text-obsidian-300 leading-relaxed max-w-lg">
            Exploring the intersection of brutalist design and luxury craftsmanship. How negative space defines the object, and restraint becomes the ultimate statement.
          </p>
          <Link href="/editorial/architecture-of-silence" className="inline-flex items-center gap-2 text-sm font-medium text-metallic-champagne underline underline-offset-4 hover:text-metallic-gold transition-colors">
            Read the Story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
