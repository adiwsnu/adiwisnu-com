"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { dateCalculator } from "@/lib/days";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function DateCalculatorForm() {
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());

  const a = new Date(from);
  const b = new Date(to);
  const valid = !Number.isNaN(a.getTime()) && !Number.isNaN(b.getTime());
  const r = valid ? dateCalculator(a, b) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            from
          </span>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            to
          </span>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
      </div>

      {r && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              ["days", r.days],
              ["weeks", r.weeks],
              ["months", r.months],
              ["years", r.years],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-border px-3 py-3 text-center"
            >
              <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 font-mono text-xl tabular-nums">
                {value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
