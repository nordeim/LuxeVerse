import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/editorial/RichTextRenderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Mock data fetch. In production: await prisma.editorial.findUnique({ where: { slug } })
const ARTICLE_MOCK = {
  slug: "architecture-of-silence",
  title: "The Architecture of Silence",
  category: "Design",
  author: "Elena Voss",
  publishedAt: "2026-05-10",
  readTime: 6,
  content: [
    { type: "text" as const, value: "Luxury is no longer defined by ornamentation. It is defined by restraint. In an era of digital noise, silence becomes the ultimate premium." },
    { type: "quote" as const, value: "Whitespace is not empty space. It is structural voice.", author: "Dieter Rams" },
    { type: "text" as const, value: "When we designed LuxeVerse, we asked: what happens when we remove everything that doesn't serve the narrative? The result is an interface that breathes." },
    { type: "product-card" as const, productId: "prod_obsidian_trench", name: "Obsidian Trench", price: 1200, image: "/products/1.jpg" },
    { type: "text" as const, value: "Craftsmanship isn't just about materials. It's about intention. Every pixel, every transition, every micro-interaction must earn its place." },
  ]
};

export function generateMetadata(): Metadata {
  const article = ARTICLE_MOCK;
  return {
    title: `${article.title} | LuxeVerse Journal`,
    description: article.content.find((c) => c.type === "text")?.value,
    openGraph: { images: ["/editorial/1.jpg"] }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (slug !== ARTICLE_MOCK.slug) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 text-center">
          <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">{ARTICLE_MOCK.category}</span>
          <h1 className="text-4xl font-display font-medium text-obsidian-900 sm:text-5xl">{ARTICLE_MOCK.title}</h1>
          <div className="flex items-center justify-center gap-3 text-sm text-obsidian-600">
            <address className="not-italic">{ARTICLE_MOCK.author}</address>
            <span aria-hidden="true">·</span>
            <time dateTime={ARTICLE_MOCK.publishedAt}>{new Date(ARTICLE_MOCK.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <span aria-hidden="true">·</span>
            <span>{ARTICLE_MOCK.readTime} min read</span>
          </div>
        </header>
        <div className="prose prose-obsidian max-w-none">
          <RichTextRenderer blocks={ARTICLE_MOCK.content} />
        </div>
      </article>
    </main>
  );
}
