import type { Metadata } from "next";
import Link from "next/link";
import {
  categories,
  categoryLabels,
  events,
  formatDelta,
  getUpcoming,
} from "@/lib/days";
import { SearchBox } from "@/components/days/search-box";

export const metadata: Metadata = {
  title: "Days — countdowns for every event",
  description:
    "Live countdown timers for holidays, seasons, sports, movies, and games. One canonical URL per event.",
};

export default function DaysHomePage() {
  const now = new Date();
  const upcoming = getUpcoming(now, 6);
  const currentYear = now.getUTCFullYear();
  const searchIndex = events.map((e) => ({ slug: e.slug, title: e.title }));

  return (
    <article className="space-y-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          days
        </p>
        <h1 className="text-2xl tracking-tight">
          Countdowns for every event.
        </h1>
        <p className="text-sm text-muted-foreground">
          Live countdown timers for holidays, seasons, sports, movies, games.
          One canonical URL per event.
        </p>
      </header>

      <SearchBox events={searchIndex} />

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          upcoming
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {upcoming.map((e) => {
            const target = e.resolve(now);
            const delta = formatDelta(target, now);
            return (
              <li key={e.slug}>
                <Link
                  href={`/days/until/${e.slug}`}
                  className="block rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors"
                >
                  <div className="text-sm">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {delta.days.toLocaleString()} days to go
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          browse
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((c) => (
            <li key={c}>
              <Link
                href={`/days/category/${c}`}
                className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                {categoryLabels[c]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/days/year/${currentYear}`}
              className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              {currentYear}
            </Link>
          </li>
          <li>
            <Link
              href={`/days/year/${currentYear + 1}`}
              className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              {currentYear + 1}
            </Link>
          </li>
          <li>
            <Link
              href="/days/date-calculator"
              className="block rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              Date Calculator
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
