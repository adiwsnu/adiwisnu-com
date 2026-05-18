import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  categories,
  categoryLabels,
  formatDelta,
  getEventsByCategory,
  type EventCategory,
} from "@/lib/days";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!categories.includes(slug as EventCategory)) return {};
  const label = categoryLabels[slug as EventCategory];
  return {
    title: `${label} Countdowns | Days`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!categories.includes(slug as EventCategory)) notFound();
  const cat = slug as EventCategory;
  const label = categoryLabels[cat];
  const list = getEventsByCategory(cat);
  const now = new Date();

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          category
        </p>
        <h1 className="text-2xl tracking-tight">{label}</h1>
      </header>

      <ul className="space-y-2">
        {list
          .map((e) => ({ e, target: e.resolve(now) }))
          .sort((a, b) => a.target.getTime() - b.target.getTime())
          .map(({ e, target }) => {
            const delta = formatDelta(target, now);
            return (
              <li key={e.slug}>
                <Link
                  href={`/days/until/${e.slug}`}
                  className="block rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm">{e.title}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {target.toUTCString().slice(5, 16)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {delta.days.toLocaleString()} days{" "}
                    {delta.direction === "until" ? "to go" : "ago"}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>

      <footer className="pt-6 border-t border-border">
        <Link
          href="/days"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← all countdowns
        </Link>
      </footer>
    </article>
  );
}
