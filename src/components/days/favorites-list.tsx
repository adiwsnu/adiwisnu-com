"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/days/favorites";
import { formatDelta, formatHuman, isoToSlugPath } from "@/lib/days";
import { useEffect, useState } from "react";

export function FavoritesList() {
  const { favorites, ready, remove } = useFavorites();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!ready) return null;
  if (favorites.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
        favorites
      </h2>
      <ul className="space-y-2">
        {favorites.map((f) => {
          const path = isoToSlugPath(f.date);
          const target = new Date(`${f.date}T00:00:00Z`);
          const delta = now ? formatDelta(target, now) : null;
          return (
            <li
              key={f.date}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <Link
                href={path ?? "/days"}
                className="flex-1 min-w-0 hover:text-muted-foreground transition-colors"
              >
                <div className="truncate text-sm">
                  {f.label || formatHuman(target)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {delta
                    ? `${delta.days.toLocaleString()} days ${
                        delta.direction === "until" ? "to go" : "ago"
                      }`
                    : formatHuman(target)}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => remove(f.date)}
                aria-label={`remove ${formatHuman(target)} from favorites`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                remove
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
