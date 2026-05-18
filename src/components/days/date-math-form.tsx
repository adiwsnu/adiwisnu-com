"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addToDate,
  formatHuman,
  isoToSlugPath,
  type DurationDirection,
  type DurationUnit,
} from "@/lib/days";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const UNITS: DurationUnit[] = ["days", "weeks", "months", "years"];

export function DateMathForm() {
  const [start, setStart] = useState(todayIso());
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<DurationUnit>("days");
  const [direction, setDirection] = useState<DurationDirection>("after");
  const router = useRouter();

  const startDate = new Date(`${start}T00:00:00Z`);
  const valid = !Number.isNaN(startDate.getTime()) && Number.isFinite(amount);
  const result = valid ? addToDate(startDate, amount, unit, direction) : null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    const iso = result.toISOString().slice(0, 10);
    const path = isoToSlugPath(iso);
    if (path) router.push(path);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="space-y-1 text-sm block">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          start date
        </span>
        <Input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            amount
          </span>
          <Input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            unit
          </span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as DurationUnit)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            direction
          </span>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as DurationDirection)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="after">after</option>
            <option value="before">before</option>
          </select>
        </label>
      </div>

      {result && (
        <p className="text-sm text-muted-foreground">
          → {amount} {unit} {direction} {formatHuman(startDate)} is{" "}
          <span className="text-foreground">{formatHuman(result)}</span>
        </p>
      )}

      <Button type="submit" disabled={!result}>
        count to that date
      </Button>
    </form>
  );
}
