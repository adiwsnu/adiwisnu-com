"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/days/favorites";
import {
  formatDelta,
  formatHumanParts,
  isoToSlugPath,
  localTargetInstant,
} from "@/lib/days";

function partsFromIso(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

export function FavoritesList() {
  const { favorites, ready, remove } = useFavorites();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!ready) return null;
  if (favorites.length === 0) return null;

  const now = new Date();
  void tick; // re-render hook every minute

  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
        favorites
      </h2>
      <ul className="space-y-2">
        {favorites.map((f) => {
          const path = isoToSlugPath(f.date);
          const parts = partsFromIso(f.date);
          const delta = parts
            ? formatDelta(localTargetInstant(parts, null), now)
            : null;
          const human = parts ? formatHumanParts(parts) : f.date;
          return (
            <li
              key={f.date}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <Link
                href={path ?? "/days"}
                className="flex-1 min-w-0 hover:text-muted-foreground transition-colors"
              >
                <div className="truncate text-sm">{f.label || human}</div>
                <div className="text-xs text-muted-foreground">
                  {delta
                    ? `${delta.days.toLocaleString()} days ${
                        delta.direction === "until" ? "to go" : "ago"
                      }`
                    : human}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => remove(f.date)}
                aria-label={`remove ${human} from favorites`}
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
