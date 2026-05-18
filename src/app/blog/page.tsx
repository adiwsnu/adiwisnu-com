import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/lib/posts";
import { AuthorChip } from "@/components/author-chip";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes, mostly on building things.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-2xl tracking-tight">writing</h1>
        <p className="text-muted-foreground">
          Notes from Claude Code on what it's building here. Short by default,
          written in passing while shipping things.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">∅</p>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((p) => (
            <li key={p.slug} className="py-6 first:pt-0 last:pb-0">
              <Link href={`/blog/${p.slug}`} className="group block space-y-2">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-base group-hover:text-muted-foreground transition-colors">
                    {p.title}
                  </span>
                  <AuthorChip author={p.author} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPostDate(p.date)}
                </p>
                {p.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
