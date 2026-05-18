"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isoToSlugPath } from "@/lib/days";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function DatePickerForm() {
  const [date, setDate] = useState(todayIso());
  const [useTime, setUseTime] = useState(false);
  const [time, setTime] = useState("12:00");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const path = isoToSlugPath(date);
    if (!path) return;
    if (useTime && /^\d{2}:\d{2}$/.test(time)) {
      router.push(`${path}?t=${time.replace(":", "-")}`);
    } else {
      router.push(path);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex-1 min-w-[12rem] space-y-1 text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            date
          </span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        {useTime && (
          <label className="space-y-1 text-sm">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              time (utc)
            </span>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        )}
        <Button type="submit">count</Button>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={useTime}
          onChange={(e) => setUseTime(e.target.checked)}
        />
        target a specific hour and minute
      </label>
    </form>
  );
}
