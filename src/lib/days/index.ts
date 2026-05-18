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

export function isoToSlugPath(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const year = m[1];
  const month = monthName(Number(m[2]));
  const day = String(Number(m[3]));
  return `/days/${day}-${month}/${year}`;
}

export function formatHuman(date: Date): string {
  return `${date.getUTCDate()} ${
    monthName(date.getUTCMonth() + 1).replace(/^./, (c) => c.toUpperCase())
  } ${date.getUTCFullYear()}`;
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
