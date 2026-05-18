import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDelta, parseDateSlug } from "@/lib/days";
import { CountdownTicker } from "@/components/days/countdown-ticker";
import { ShareButtons } from "@/components/days/share-buttons";

type Props = {
  params: Promise<{ date: string; year: string }>;
  searchParams: Promise<{ t?: string }>;
};

export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { date, year } = await params;
  const { t } = await searchParams;
  const target = parseDateSlug(date, year);
  if (!target) return {};
  const direction =
    target.getTime() >= Date.now() ? "until" : "since";
  const label = t?.trim() || target.toUTCString().slice(0, 16);
  return {
    title: `How Many Days ${direction} ${label}? | Countdown`,
  };
}

export default async function DateKeyedPage({ params, searchParams }: Props) {
  const { date, year } = await params;
  const { t } = await searchParams;
  const target = parseDateSlug(date, year);
  if (!target) notFound();

  const now = new Date();
  const delta = formatDelta(target, now);
  const label = t?.trim() || target.toUTCString().slice(0, 16);
  const dateLabel = target.toUTCString().slice(0, 16);

  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          <Link
            href={`/days/year/${year}`}
            className="hover:text-foreground transition-colors"
          >
            {year}
          </Link>
        </p>
        <h1 className="text-2xl tracking-tight">
          How Many Days {delta.direction} {label}?
        </h1>
        <p className="text-sm text-muted-foreground">{dateLabel}</p>
      </header>

      <CountdownTicker targetIso={target.toISOString()} initial={delta} />

      <ShareButtons
        path={`/days/date/${date}/${year}${t ? `?t=${encodeURIComponent(t)}` : ""}`}
        title={`How Many Days ${delta.direction} ${label}?`}
      />

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
