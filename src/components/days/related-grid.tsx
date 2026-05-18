import Link from "next/link";
import type { EventRecord } from "@/lib/days";
import { formatDelta } from "@/lib/days";

type Props = {
  events: EventRecord[];
  now: Date;
};

export function RelatedGrid({ events, now }: Props) {
  if (!events.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
        related countdowns
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {events.map((e) => {
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
                  {delta.days.toLocaleString()} days{" "}
                  {delta.direction === "until" ? "to go" : "ago"}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
