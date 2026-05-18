import { events, categoryLabels } from "./catalogue";
import type { EventRecord, EventCategory } from "./catalogue";

export { events, categoryLabels };
export type { EventRecord, EventCategory };

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export function monthName(m: number): string {
  return MONTHS[m - 1] ?? "";
}

export function parseDateSlug(
  dateSegment: string,
  yearSegment: string,
): Date | null {
  const m = /^(\d{1,2})-([a-z]+)$/i.exec(dateSegment);
  if (!m) return null;
  const day = Number(m[1]);
  const monthIdx = MONTHS.indexOf(m[2].toLowerCase());
  if (monthIdx < 0) return null;
  if (!/^\d{4}$/.test(yearSegment)) return null;
  const year = Number(yearSegment);
  if (year < 1900 || year > 9999) return null;
  const date = new Date(Date.UTC(year, monthIdx, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIdx ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatDateSlug(date: Date): { date: string; year: string } {
  const day = date.getUTCDate();
  const month = monthName(date.getUTCMonth() + 1);
  return { date: `${day}-${month}`, year: String(date.getUTCFullYear()) };
}

export type Delta = {
  direction: "until" | "since";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

export function formatDelta(target: Date, now: Date): Delta {
  const diff = target.getTime() - now.getTime();
  const direction: "until" | "since" = diff >= 0 ? "until" : "since";
  let ms = Math.abs(diff);
  const days = Math.floor(ms / 86_400_000);
  ms -= days * 86_400_000;
  const hours = Math.floor(ms / 3_600_000);
  ms -= hours * 3_600_000;
  const minutes = Math.floor(ms / 60_000);
  ms -= minutes * 60_000;
  const seconds = Math.floor(ms / 1_000);
  return { direction, days, hours, minutes, seconds, totalMs: Math.abs(diff) };
}

export function getEventBySlug(slug: string): EventRecord | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventsByCategory(cat: EventCategory): EventRecord[] {
  return events.filter((e) => e.category === cat);
}

export function getEventsInYear(year: number, now: Date): EventRecord[] {
  return events
    .map((e) => ({ event: e, date: e.resolve(now) }))
    .filter((x) => x.date.getUTCFullYear() === year)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((x) => x.event);
}

export function getRelated(slug: string): EventRecord[] {
  const e = getEventBySlug(slug);
  if (!e || !e.related) return [];
  return e.related
    .map((s) => getEventBySlug(s))
    .filter((x): x is EventRecord => Boolean(x));
}

export function getUpcoming(now: Date, limit = 6): EventRecord[] {
  return events
    .map((e) => ({ event: e, date: e.resolve(now) }))
    .filter((x) => x.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit)
    .map((x) => x.event);
}

export function dateCalculator(a: Date, b: Date) {
  const totalMs = Math.abs(b.getTime() - a.getTime());
  const days = Math.floor(totalMs / 86_400_000);
  const weeks = Math.floor(days / 7);
  const earlier = a.getTime() <= b.getTime() ? a : b;
  const later = a.getTime() <= b.getTime() ? b : a;
  let years = later.getUTCFullYear() - earlier.getUTCFullYear();
  let months = later.getUTCMonth() - earlier.getUTCMonth();
  if (later.getUTCDate() < earlier.getUTCDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { totalMs, days, weeks, months: years * 12 + months, years };
}

export const categories: EventCategory[] = [
  "holiday",
  "season",
  "sport",
  "movie",
  "game",
];
