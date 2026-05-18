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
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const path = isoToSlugPath(date);
    if (path) router.push(path);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
      <label className="flex-1 min-w-[12rem] space-y-1 text-sm">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          pick a date
        </span>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <Button type="submit">count</Button>
    </form>
  );
}
