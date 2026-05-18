import {
  calendarBreakdown,
  dayOfYear,
  daysInYear,
  isLeapYear,
  isoWeek,
  quarterOf,
  weekdayName,
} from "@/lib/days";

type Props = {
  target: Date;
  now: Date;
  hasTime: boolean;
};

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

export function DateDetails({ target, now, hasTime }: Props) {
  const year = target.getUTCFullYear();
  const doy = dayOfYear(target);
  const total = daysInYear(year);
  const { week, year: weekYear } = isoWeek(target);
  const quarter = quarterOf(target);
  const breakdown = calendarBreakdown(target, now);
  const breakdownDirection = target.getTime() >= now.getTime() ? "from now" : "ago";
  const totalMs = Math.abs(target.getTime() - now.getTime());
  const totalDays = Math.floor(totalMs / 86_400_000);
  const totalHours = Math.floor(totalMs / 3_600_000);
  const totalMinutes = Math.floor(totalMs / 60_000);
  const totalSeconds = Math.floor(totalMs / 1_000);
  const totalWeeks = Math.floor(totalDays / 7);
  const unixSeconds = Math.floor(target.getTime() / 1000);

  const parts: string[] = [];
  if (breakdown.years) parts.push(`${breakdown.years} year${breakdown.years === 1 ? "" : "s"}`);
  if (breakdown.months) parts.push(`${breakdown.months} month${breakdown.months === 1 ? "" : "s"}`);
  if (breakdown.days || !parts.length)
    parts.push(`${breakdown.days} day${breakdown.days === 1 ? "" : "s"}`);
  const calendarString = `${parts.join(", ")} ${breakdownDirection}`;

  const remainingInYear = total - doy;

  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
        details
      </h2>
      <dl className="rounded-lg border border-border px-4 py-1">
        {row("Day of the week", weekdayName(target))}
        {row("Day of the year", `${doy} of ${total}`)}
        {row(
          "Remaining in the year",
          `${remainingInYear} day${remainingInYear === 1 ? "" : "s"}`,
        )}
        {row("ISO week", `Week ${week} of ${weekYear}`)}
        {row("Calendar quarter", `Q${quarter} ${year}`)}
        {row("Leap year", isLeapYear(year) ? "yes" : "no")}
        {row("Calendar distance", calendarString)}
        {row("In days", totalDays.toLocaleString())}
        {row("In weeks", totalWeeks.toLocaleString())}
        {row("In hours", totalHours.toLocaleString())}
        {row("In minutes", totalMinutes.toLocaleString())}
        {row("In seconds", totalSeconds.toLocaleString())}
        {row("Unix timestamp", unixSeconds.toLocaleString())}
        {row(
          "Interpreted as",
          hasTime
            ? `${target.toISOString().slice(0, 16).replace("T", " ")} UTC`
            : `${target.toISOString().slice(0, 10)} (end of day UTC)`,
        )}
      </dl>
    </section>
  );
}
