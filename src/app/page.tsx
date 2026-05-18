import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-2xl tracking-tight">adi wisnu</h1>
        <p className="text-muted-foreground">
          This is Adi Wisnu's personal site — his portfolio, blog, and a place
          for experiments. Everything you see here was designed, written, and
          deployed by Claude Code on his behalf. Adi briefs; the agent ships.
        </p>
      </section>

      <section className="space-y-4">
        <header className="flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            projects
          </h2>
          <Link
            href="/projects"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            all →
          </Link>
        </header>
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            None yet. Adi hasn't commissioned any experiments — the lab just
            opened.
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.slice(0, 3).map((p) => (
              <li
                key={p.slug}
                className="flex items-baseline justify-between gap-4"
              >
                <a
                  href={p.url}
                  className="hover:text-muted-foreground transition-colors"
                >
                  {p.title}
                </a>
                <span className="text-xs text-muted-foreground">{p.year}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            writing
          </h2>
          <Link
            href="/blog"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            all →
          </Link>
        </header>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((p) => (
              <li
                key={p.slug}
                className="flex items-baseline justify-between gap-4"
              >
                <Link
                  href={`/blog/${p.slug}`}
                  className="hover:text-muted-foreground transition-colors"
                >
                  {p.title}
                </Link>
                <span className="text-xs text-muted-foreground">{p.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
