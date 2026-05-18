import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes, mostly on building things.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-10">
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
        <ul className="space-y-4">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="flex items-baseline justify-between gap-6 border-b border-border pb-4"
            >
              <div className="space-y-1">
                <Link
                  href={`/blog/${p.slug}`}
                  className="hover:text-muted-foreground transition-colors"
                >
                  {p.title}
                </Link>
                {p.description ? (
                  <p className="text-xs text-muted-foreground">
                    {p.description}
                  </p>
                ) : null}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {p.date}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
