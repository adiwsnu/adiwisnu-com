"use client";

import { useEffect, useState } from "react";
import {
  formatDelta,
  localTargetInstant,
  type DateParts,
  type Delta,
} from "@/lib/days";

type Props = {
  parts: DateParts;
  time: { h: number; m: number } | null;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const PLACEHOLDER: Delta = {
  direction: "until",
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalMs: 0,
};

export function CountdownTicker({ parts, time }: Props) {
  const [delta, setDelta] = useState<Delta>(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const target = localTargetInstant(parts, time);
    const tick = () => setDelta(formatDelta(target, new Date()));
    tick();
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [parts, time]);

  const cells: { label: string; value: string }[] = [
    { label: "days", value: mounted ? delta.days.toLocaleString() : "—" },
    { label: "hours", value: mounted ? pad(delta.hours) : "—" },
    { label: "minutes", value: mounted ? pad(delta.minutes) : "—" },
    { label: "seconds", value: mounted ? pad(delta.seconds) : "—" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {!mounted
          ? "computing in your local time…"
          : delta.direction === "until"
            ? "time remaining"
            : "time elapsed"}
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
