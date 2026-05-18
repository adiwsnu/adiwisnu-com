import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  events,
  formatDelta,
  getEventBySlug,
  getRelated,
} from "@/lib/days";
import { CountdownTicker } from "@/components/days/countdown-ticker";
import { ShareButtons } from "@/components/days/share-buttons";
import { RelatedGrid } from "@/components/days/related-grid";
import { EffectLayer } from "@/components/days/effect-layer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  const now = new Date();
  const target = event.resolve(now);
  const direction = target.getTime() >= now.getTime() ? "until" : "since";
  return {
    title: `How Many Days ${direction} ${event.title}? | Countdown`,
    description: `Live countdown ${direction === "until" ? "to" : "from"} ${event.title}.`,
  };
}

export default async function NamedEventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const now = new Date();
  const target = event.resolve(now);
  const delta = formatDelta(target, now);
  const dateLabel = target.toUTCString().slice(0, 16);
  const related = getRelated(slug);

  return (
    <div
      className={`relative -mx-6 px-6 -my-16 sm:-my-24 py-16 sm:py-24 ${event.background ?? ""}`}
    >
      <EffectLayer effect={event.effect ?? null} />
      <article className="relative z-10 space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            <Link
              href={`/days/category/${event.category}`}
              className="hover:text-foreground transition-colors"
            >
              {event.category}
            </Link>
          </p>
          <h1 className="text-2xl tracking-tight">
            How Many Days {delta.direction} {event.title}?
          </h1>
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
        </header>

        <CountdownTicker targetIso={target.toISOString()} initial={delta} />

        <ShareButtons
          path={`/days/until/${event.slug}`}
          title={`How Many Days ${delta.direction} ${event.title}?`}
        />

        <RelatedGrid events={related} now={now} />

        <footer className="pt-6 border-t border-border">
          <Link
            href="/days"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← all countdowns
          </Link>
        </footer>
      </article>
    </div>
  );
}
