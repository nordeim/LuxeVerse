import type { ReactElement } from "react";
import Link from "next/link";

export default function HomePage(): ReactElement {
  return (
    <section className="flex min-h-hero flex-col items-center justify-center px-4 text-center">
      <h1 className="text-hero font-display font-light tracking-tight text-obsidian-950">
        Digital Haute Couture
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-obsidian-700">
        Where cinematic storytelling meets intelligent commerce.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/shop"
          className="rounded-lg bg-metallic-champagne px-6 py-3 text-obsidian-950 font-medium hover:bg-metallic-gold transition-colors"
        >
          Explore Collection
        </Link>
        <Link
          href="/editorial"
          className="rounded-lg border border-obsidian-900/20 px-6 py-3 text-obsidian-900 font-medium hover:bg-obsidian-900/5 transition-colors"
        >
          Read Editorial
        </Link>
      </div>
    </section>
  );
}
