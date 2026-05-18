import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDelta, formatHuman, parseDateSlug } from "@/lib/days";
import { CountdownTicker } from "@/components/days/countdown-ticker";
import { FavoriteToggle } from "@/components/days/favorite-toggle";

type Props = {
  params: Promise<{ date: string; year: string }>;
};

export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date, year } = await params;
  const target = parseDateSlug(date, year);
  if (!target) return {};
  const direction = target.getTime() >= Date.now() ? "until" : "since";
  const human = formatHuman(target);
  return {
    title: `How Many Days ${direction} ${human}?`,
  };
}

export default async function DateKeyedPage({ params }: Props) {
  const { date, year } = await params;
  const target = parseDateSlug(date, year);
  if (!target) notFound();

  const now = new Date();
  const delta = formatDelta(target, now);
  const human = formatHuman(target);
  const isoDate = target.toISOString().slice(0, 10);

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {delta.direction === "until" ? "counting down to" : "counting up from"}
        </p>
        <h1 className="text-2xl tracking-tight">{human}</h1>
      </header>

      <CountdownTicker targetIso={target.toISOString()} initial={delta} />

      <FavoriteToggle isoDate={isoDate} defaultLabel={human} />

      <footer className="pt-6 border-t border-border">
        <Link
          href="/days"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← pick another date
        </Link>
      </footer>
    </article>
  );
}
