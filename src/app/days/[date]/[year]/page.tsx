import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatDelta,
  formatHuman,
  parseDateSlug,
  parseTimeQuery,
} from "@/lib/days";
import { CountdownTicker } from "@/components/days/countdown-ticker";
import { FavoriteToggle } from "@/components/days/favorite-toggle";
import { DateDetails } from "@/components/days/date-details";

type Props = {
  params: Promise<{ date: string; year: string }>;
  searchParams: Promise<{ t?: string }>;
};

export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

/**
 * If no `?t=HH-MM` is given, treat the date as the *end* of the day in UTC
 * (23:59:59.999). That matches days.to's convention: "22 July 2025" reads as
 * the whole day, not the single instant of its midnight. Otherwise an
 * elapsed-days count flips one day earlier than people expect.
 */
function buildTarget(
  base: Date,
  time: { h: number; m: number } | null,
): Date {
  if (!time) {
    return new Date(
      Date.UTC(
        base.getUTCFullYear(),
        base.getUTCMonth(),
        base.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
  }
  return new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate(),
      time.h,
      time.m,
      0,
      0,
    ),
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { date, year } = await params;
  const { t } = await searchParams;
  const base = parseDateSlug(date, year);
  if (!base) return {};
  const time = parseTimeQuery(t);
  const target = buildTarget(base, time);
  const direction = target.getTime() >= Date.now() ? "until" : "since";
  return {
    title: `How Many Days ${direction} ${formatHuman(base)}?`,
  };
}

export default async function DateKeyedPage({ params, searchParams }: Props) {
  const { date, year } = await params;
  const { t } = await searchParams;
  const base = parseDateSlug(date, year);
  if (!base) notFound();
  if (t && !parseTimeQuery(t)) notFound();
  const time = parseTimeQuery(t);
  const target = buildTarget(base, time);

  const now = new Date();
  const delta = formatDelta(target, now);
  const human = formatHuman(target, Boolean(time));
  const isoDate = base.toISOString().slice(0, 10);

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {delta.direction === "until" ? "counting down to" : "counting up from"}
        </p>
        <h1 className="text-2xl tracking-tight">{human}</h1>
      </header>

      <CountdownTicker targetIso={target.toISOString()} initial={delta} />

      <FavoriteToggle isoDate={isoDate} defaultLabel={formatHuman(base)} />

      <DateDetails target={target} now={now} hasTime={Boolean(time)} />

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
