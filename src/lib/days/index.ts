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

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function monthName(m: number): string {
  return MONTHS[m - 1] ?? "";
}

export type DateParts = { year: number; month: number; day: number };

export function parseDateSlugParts(
  dateSegment: string,
  yearSegment: string,
): DateParts | null {
  const m = /^(\d{1,2})-([a-z]+)$/i.exec(dateSegment);
  if (!m) return null;
  const day = Number(m[1]);
  const monthIdx = MONTHS.indexOf(m[2].toLowerCase());
  if (monthIdx < 0) return null;
  if (!/^\d{4}$/.test(yearSegment)) return null;
  const year = Number(yearSegment);
  if (year < 1900 || year > 9999) return null;
  // Validate via UTC reconstruction — calendar-day-only, no TZ implied.
  const probe = new Date(Date.UTC(year, monthIdx, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== monthIdx ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month: monthIdx + 1, day };
}

export function parseDateSlug(
  dateSegment: string,
  yearSegment: string,
): Date | null {
  const parts = parseDateSlugParts(dateSegment, yearSegment);
  if (!parts) return null;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
}

/**
 * Build the visitor-local target instant for a date (and optional time).
 *
 * Without a time, anchors to 23:59:59.999 of the chosen calendar day in the
 * visitor's local timezone — so "until 22 July 2025" rolls over at the
 * visitor's local midnight, not UTC midnight. With a time, anchors to that
 * exact local hh:mm.
 *
 * This MUST be called on the client. The local timezone is whatever the
 * browser reports.
 */
export function localTargetInstant(
  parts: DateParts,
  time: { h: number; m: number } | null,
): Date {
  if (time) {
    return new Date(parts.year, parts.month - 1, parts.day, time.h, time.m, 0, 0);
  }
  return new Date(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999);
}

export function formatHumanParts(
  parts: DateParts,
  time?: { h: number; m: number } | null,
): string {
  const month = monthName(parts.month).replace(/^./, (c) => c.toUpperCase());
  const base = `${parts.day} ${month} ${parts.year}`;
  if (!time) return base;
  const hh = String(time.h).padStart(2, "0");
  const mm = String(time.m).padStart(2, "0");
  return `${base}, ${hh}:${mm}`;
}

/** Parse "HH-MM" or "HH:MM" → { h, m } or null. */
export function parseTimeQuery(t: string | undefined): {
  h: number;
  m: number;
} | null {
  if (!t) return null;
  const match = /^(\d{1,2})[-:](\d{2})$/.exec(t);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

export function formatDateSlug(date: Date): { date: string; year: string } {
  const day = date.getUTCDate();
  const month = monthName(date.getUTCMonth() + 1);
  return { date: `${day}-${month}`, year: String(date.getUTCFullYear()) };
}

export function isoToSlugPath(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const year = m[1];
  const month = monthName(Number(m[2]));
  const day = String(Number(m[3]));
  return `/days/${day}-${month}/${year}`;
}

export function formatHuman(date: Date, withTime = false): string {
  const base = `${date.getUTCDate()} ${
    monthName(date.getUTCMonth() + 1).replace(/^./, (c) => c.toUpperCase())
  } ${date.getUTCFullYear()}`;
  if (!withTime) return base;
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${base}, ${hh}:${mm} UTC`;
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

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

export function isoWeek(date: Date): { week: number; year: number } {
  // ISO 8601 week date: week containing the year's first Thursday.
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getUTCDay()];
}

export function quarterOf(date: Date): number {
  return Math.floor(date.getUTCMonth() / 3) + 1;
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export type DurationUnit = "days" | "weeks" | "months" | "years";
export type DurationDirection = "after" | "before";

/**
 * Add (or subtract) a whole number of days/weeks/months/years to a UTC date.
 * Months/years use calendar arithmetic and clamp the day if the target month
 * is shorter (e.g. Jan 31 + 1 month → Feb 28 in a non-leap year).
 */
export function addToDate(
  start: Date,
  amount: number,
  unit: DurationUnit,
  direction: DurationDirection,
): Date {
  const sign = direction === "after" ? 1 : -1;
  const n = sign * amount;
  const y = start.getUTCFullYear();
  const m = start.getUTCMonth();
  const d = start.getUTCDate();

  if (unit === "days") {
    return new Date(Date.UTC(y, m, d + n));
  }
  if (unit === "weeks") {
    return new Date(Date.UTC(y, m, d + n * 7));
  }
  if (unit === "months") {
    const targetMonth = m + n;
    const targetYear = y + Math.floor(targetMonth / 12);
    const normalMonth = ((targetMonth % 12) + 12) % 12;
    const lastDay = new Date(Date.UTC(targetYear, normalMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(targetYear, normalMonth, Math.min(d, lastDay)));
  }
  // years
  const targetYear = y + n;
  const lastDay = new Date(Date.UTC(targetYear, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, m, Math.min(d, lastDay)));
}

/** Calendar-aware breakdown: years / months / days between two dates. */
export function calendarBreakdown(a: Date, b: Date) {
  const earlier = a.getTime() <= b.getTime() ? a : b;
  const later = a.getTime() <= b.getTime() ? b : a;
  let years = later.getUTCFullYear() - earlier.getUTCFullYear();
  let months = later.getUTCMonth() - earlier.getUTCMonth();
  let days = later.getUTCDate() - earlier.getUTCDate();
  if (days < 0) {
    months -= 1;
    const borrowedMonth = new Date(
      Date.UTC(later.getUTCFullYear(), later.getUTCMonth(), 0),
    );
    days += borrowedMonth.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}
