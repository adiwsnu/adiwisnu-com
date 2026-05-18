import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  formatHumanParts,
  parseDateSlugParts,
  parseTimeQuery,
} from "@/lib/days";
import { CountdownTicker } from "@/components/days/countdown-ticker";
import { FavoriteToggle } from "@/components/days/favorite-toggle";
import { DateDetails } from "@/components/days/date-details";

type Props = {
  params: Promise<{ date: string; year: string }>;
  searchParams: Promise<{ t?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { date, year } = await params;
  const { t } = await searchParams;
  const parts = parseDateSlugParts(date, year);
  if (!parts) return {};
  const time = parseTimeQuery(t);
  return {
    title: `How Many Days to ${formatHumanParts(parts, time)}?`,
  };
}

export default async function DateKeyedPage({ params, searchParams }: Props) {
  const { date, year } = await params;
  const { t } = await searchParams;
  const parts = parseDateSlugParts(date, year);
  if (!parts) notFound();
  if (t && !parseTimeQuery(t)) notFound();
  const time = parseTimeQuery(t);

  const human = formatHumanParts(parts, time);
  const isoDate = `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {time ? "target time" : "target day"}
        </p>
        <h1 className="text-2xl tracking-tight">{human}</h1>
      </header>

      <CountdownTicker parts={parts} time={time} />

      <FavoriteToggle isoDate={isoDate} defaultLabel={formatHumanParts(parts)} />

      <DateDetails parts={parts} time={time} />

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
