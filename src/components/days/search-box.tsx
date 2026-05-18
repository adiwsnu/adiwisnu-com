"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import type { EventRecord } from "@/lib/days";

type Props = {
  events: Pick<EventRecord, "slug" | "title">[];
};

export function SearchBox({ events }: Props) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [] as Pick<EventRecord, "slug" | "title">[];
    return events
      .filter(
        (e) =>
          e.title.toLowerCase().includes(needle) ||
          e.slug.toLowerCase().includes(needle),
      )
      .slice(0, 6);
  }, [q, events]);

  function go(slug: string) {
    router.push(`/days/until/${slug}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches[0]) go(matches[0].slug);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search events — christmas, fifa, summer…"
        aria-label="search events"
      />
      {matches.length > 0 && (
        <ul className="rounded-lg border border-border divide-y divide-border">
          {matches.map((m) => (
            <li key={m.slug}>
              <button
                type="button"
                onClick={() => go(m.slug)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                {m.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
