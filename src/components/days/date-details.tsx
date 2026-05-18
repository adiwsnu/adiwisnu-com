"use client";

import { useEffect, useState } from "react";
import {
  isLeapYear,
  localTargetInstant,
  type DateParts,
} from "@/lib/days";

type Props = {
  parts: DateParts;
  time: { h: number; m: number } | null;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PLACEHOLDER = "—";

function row(label: string, value: string) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/50 py-2 last:border-0">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-right tabular-nums">{value}</dd>
    </div>
  );
}

type Computed = {
  weekday: string;
  doy: number;
  total: number;
  isoWeek: number;
  isoWeekYear: number;
  quarter: number;
  leap: boolean;
  calendar: string;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  unix: number;
  interpreted: string;
};

function dayOfYearLocal(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0).getTime();
  return Math.floor((d.getTime() - start) / 86_400_000);
}

function isoWeekLocal(date: Date): { week: number; year: number } {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { week, year: d.getFullYear() };
}

function calendarBreakdownLocal(a: Date, b: Date) {
  const earlier = a.getTime() <= b.getTime() ? a : b;
  const later = a.getTime() <= b.getTime() ? b : a;
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();
  if (days < 0) {
    months -= 1;
    const borrowed = new Date(later.getFullYear(), later.getMonth(), 0);
    days += borrowed.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function compute(parts: DateParts, time: Props["time"]): Computed {
  const target = localTargetInstant(parts, time);
  const now = new Date();

  const weekday = WEEKDAYS[target.getDay()];
  const doy = dayOfYearLocal(target);
  const total = isLeapYear(target.getFullYear()) ? 366 : 365;
  const { week, year: isoYear } = isoWeekLocal(target);
  const quarter = Math.floor(target.getMonth() / 3) + 1;
  const leap = isLeapYear(target.getFullYear());

  const bd = calendarBreakdownLocal(target, now);
  const dir = target.getTime() >= now.getTime() ? "from now" : "ago";
  const parts2: string[] = [];
  if (bd.years) parts2.push(`${bd.years} year${bd.years === 1 ? "" : "s"}`);
  if (bd.months) parts2.push(`${bd.months} month${bd.months === 1 ? "" : "s"}`);
  if (bd.days || !parts2.length)
    parts2.push(`${bd.days} day${bd.days === 1 ? "" : "s"}`);
  const calendar = `${parts2.join(", ")} ${dir}`;

  const totalMs = Math.abs(target.getTime() - now.getTime());
  const totalDays = Math.floor(totalMs / 86_400_000);
  const totalHours = Math.floor(totalMs / 3_600_000);
  const totalMinutes = Math.floor(totalMs / 60_000);
  const totalSeconds = Math.floor(totalMs / 1_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const unix = Math.floor(target.getTime() / 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const interpreted = time
    ? `${pad(time.h)}:${pad(time.m)} in your local time`
    : "end of day in your local time";

  return {
    weekday,
    doy,
    total,
    isoWeek: week,
    isoWeekYear: isoYear,
    quarter,
    leap,
    calendar,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    unix,
    interpreted,
  };
}

export function DateDetails({ parts, time }: Props) {
  const [c, setC] = useState<Computed | null>(null);

  useEffect(() => {
    setC(compute(parts, time));
    const id = setInterval(() => setC(compute(parts, time)), 60_000);
    return () => clearInterval(id);
  }, [parts, time]);

  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
        details
      </h2>
      <dl className="rounded-lg border border-border px-4 py-1">
        {row("Day of the week", c?.weekday ?? PLACEHOLDER)}
        {row(
          "Day of the year",
          c ? `${c.doy} of ${c.total}` : PLACEHOLDER,
        )}
        {row(
          "Remaining in the year",
          c
            ? `${c.total - c.doy} day${c.total - c.doy === 1 ? "" : "s"}`
            : PLACEHOLDER,
        )}
        {row(
          "ISO week",
          c ? `Week ${c.isoWeek} of ${c.isoWeekYear}` : PLACEHOLDER,
        )}
        {row(
          "Calendar quarter",
          c ? `Q${c.quarter} ${parts.year}` : PLACEHOLDER,
        )}
        {row("Leap year", c ? (c.leap ? "yes" : "no") : PLACEHOLDER)}
        {row("Calendar distance", c?.calendar ?? PLACEHOLDER)}
        {row("In days", c?.totalDays.toLocaleString() ?? PLACEHOLDER)}
        {row("In weeks", c?.totalWeeks.toLocaleString() ?? PLACEHOLDER)}
        {row("In hours", c?.totalHours.toLocaleString() ?? PLACEHOLDER)}
        {row("In minutes", c?.totalMinutes.toLocaleString() ?? PLACEHOLDER)}
        {row("In seconds", c?.totalSeconds.toLocaleString() ?? PLACEHOLDER)}
        {row("Unix timestamp", c?.unix.toLocaleString() ?? PLACEHOLDER)}
        {row("Interpreted as", c?.interpreted ?? PLACEHOLDER)}
      </dl>
    </section>
  );
}
