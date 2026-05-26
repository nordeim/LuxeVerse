import Image from "next/image";
import Link from "next/link";
import { cn } from "@luxeverse/utils";

export interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    category: string;
    title: string;
    excerpt?: string | null;
    cover?: string | null;
    coverImage?: string | null;
    author: string;
    readTime: number;
    featured?: boolean;
  };
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const coverImage = article.coverImage ?? article.cover ?? "/placeholder-editorial.jpg";
  const excerpt = article.excerpt ?? "";

  return (
    <article className={cn("group flex flex-col gap-4", featured ? "gap-6" : "")}>
      <div className={cn("relative overflow-hidden rounded-xl bg-obsidian-100", featured ? "aspect-[16/9]" : "aspect-[4/3]")}>
        <Image
          src={coverImage}
          alt={article.title}
          width={featured ? 1200 : 600}
          height={featured ? 675 : 450}
          className="h-full w-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 rounded-full bg-obsidian-50/90 px-3 py-1 text-xs font-medium text-obsidian-900 backdrop-blur-sm">
          {article.category}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={cn("font-display font-medium text-obsidian-900 group-hover:text-neon-cyan transition-colors", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          <Link href={`/editorial/${article.slug}`} className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-md">
            {article.title}
          </Link>
        </h2>
        <p className="text-sm text-obsidian-600 line-clamp-2">{excerpt}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-obsidian-500">
          <span>{article.author}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
