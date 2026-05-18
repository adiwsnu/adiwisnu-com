"use client";

import { useEffect, useState } from "react";
import { formatDelta, type Delta } from "@/lib/days";

type Props = {
  targetIso: string;
  initial: Delta;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTicker({ targetIso, initial }: Props) {
  const [delta, setDelta] = useState<Delta>(initial);

  useEffect(() => {
    const target = new Date(targetIso);
    const tick = () => setDelta(formatDelta(target, new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const cells: { label: string; value: string }[] = [
    { label: "days", value: delta.days.toLocaleString() },
    { label: "hours", value: pad(delta.hours) },
    { label: "minutes", value: pad(delta.minutes) },
    { label: "seconds", value: pad(delta.seconds) },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {delta.direction === "until" ? "time remaining" : "time elapsed"}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-border bg-card px-2 py-3 text-center"
          >
            <div className="font-mono text-2xl sm:text-3xl tabular-nums tracking-tight">
              {c.value}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
