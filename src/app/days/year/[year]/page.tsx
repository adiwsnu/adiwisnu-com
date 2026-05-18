import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDelta, getEventsInYear, formatDateSlug } from "@/lib/days";

type Props = { params: Promise<{ year: string }> };

export const dynamicParams = true;
export function generateStaticParams() {
  const now = new Date();
  const y = now.getUTCFullYear();
  return [y, y + 1, y + 2].map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) return {};
  return {
    title: `Countdowns in ${year} | Days`,
    description: `Holidays, seasons, sports, movies and games in ${year}.`,
  };
}

export default async function YearHubPage({ params }: Props) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();
  const yearNum = Number(year);

  const now = new Date();
  const eventsInYear = getEventsInYear(yearNum, now);

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          year hub
        </p>
        <h1 className="text-2xl tracking-tight">Countdowns in {year}</h1>
        <p className="text-sm text-muted-foreground">
          {eventsInYear.length} catalogued event
          {eventsInYear.length === 1 ? "" : "s"}.
        </p>
      </header>

      {eventsInYear.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No catalogued events for {year}. Try{" "}
          <Link href="/days" className="underline underline-offset-4">
            the hub
          </Link>{" "}
          or pick any date below.
        </p>
      ) : (
        <ul className="space-y-2">
          {eventsInYear.map((e) => {
            const target = e.resolve(now);
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
      )}

      <section className="space-y-2 pt-6 border-t border-border">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          jump to a specific date in {year}
        </h2>
        <p className="text-sm text-muted-foreground">
          Use a URL like{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            /days/date/{formatDateSlug(new Date(Date.UTC(yearNum, 0, 1))).date}/
            {year}
          </code>
          .
        </p>
      </section>

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
