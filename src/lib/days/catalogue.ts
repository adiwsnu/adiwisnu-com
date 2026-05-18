export type EventCategory =
  | "holiday"
  | "season"
  | "sport"
  | "movie"
  | "game"
  | "other";

export type EventEffect =
  | "snow"
  | "confetti"
  | "fireworks"
  | "hearts"
  | "leaves"
  | null;

export type EventRecord = {
  slug: string;
  title: string;
  category: EventCategory;
  resolve: (now: Date) => Date;
  effect?: EventEffect;
  background?: string;
  related?: string[];
};

function annual(month: number, day: number) {
  return (now: Date) => {
    const year = now.getUTCFullYear();
    const candidate = new Date(Date.UTC(year, month - 1, day));
    if (candidate.getTime() < now.getTime()) {
      return new Date(Date.UTC(year + 1, month - 1, day));
    }
    return candidate;
  };
}

function nthWeekdayOfMonth(month: number, weekday: number, n: number) {
  return (now: Date) => {
    const year = now.getUTCFullYear();
    const compute = (y: number) => {
      const first = new Date(Date.UTC(y, month - 1, 1));
      const shift = (weekday - first.getUTCDay() + 7) % 7;
      return new Date(Date.UTC(y, month - 1, 1 + shift + (n - 1) * 7));
    };
    const candidate = compute(year);
    if (candidate.getTime() < now.getTime()) return compute(year + 1);
    return candidate;
  };
}

function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function easter() {
  return (now: Date) => {
    const year = now.getUTCFullYear();
    const candidate = easterSunday(year);
    if (candidate.getTime() < now.getTime()) return easterSunday(year + 1);
    return candidate;
  };
}

function fixedDate(iso: string) {
  return () => new Date(iso);
}

export const events: EventRecord[] = [
  // Holidays
  {
    slug: "christmas",
    title: "Christmas",
    category: "holiday",
    resolve: annual(12, 25),
    effect: "snow",
    background:
      "bg-gradient-to-b from-red-50 to-emerald-50 dark:from-red-950/30 dark:to-emerald-950/30",
    related: ["new-year", "thanksgiving", "winter"],
  },
  {
    slug: "new-year",
    title: "New Year",
    category: "holiday",
    resolve: annual(1, 1),
    effect: "fireworks",
    background:
      "bg-gradient-to-b from-indigo-100 to-amber-50 dark:from-indigo-950/40 dark:to-amber-950/30",
    related: ["christmas", "winter"],
  },
  {
    slug: "valentines-day",
    title: "Valentine's Day",
    category: "holiday",
    resolve: annual(2, 14),
    effect: "hearts",
    background:
      "bg-gradient-to-b from-rose-100 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30",
    related: ["new-year", "easter"],
  },
  {
    slug: "halloween",
    title: "Halloween",
    category: "holiday",
    resolve: annual(10, 31),
    effect: "leaves",
    background:
      "bg-gradient-to-b from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30",
    related: ["thanksgiving", "autumn"],
  },
  {
    slug: "thanksgiving",
    title: "Thanksgiving",
    category: "holiday",
    resolve: nthWeekdayOfMonth(11, 4, 4),
    effect: "leaves",
    background:
      "bg-gradient-to-b from-amber-100 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30",
    related: ["christmas", "halloween", "autumn"],
  },
  {
    slug: "easter",
    title: "Easter",
    category: "holiday",
    resolve: easter(),
    effect: "confetti",
    background:
      "bg-gradient-to-b from-violet-100 to-yellow-50 dark:from-violet-950/40 dark:to-yellow-950/30",
    related: ["spring", "valentines-day"],
  },

  // Seasons (northern hemisphere, approximate)
  {
    slug: "spring",
    title: "Spring",
    category: "season",
    resolve: annual(3, 20),
    effect: "confetti",
    background:
      "bg-gradient-to-b from-green-100 to-yellow-50 dark:from-green-950/40 dark:to-yellow-950/30",
    related: ["summer", "easter"],
  },
  {
    slug: "summer",
    title: "Summer",
    category: "season",
    resolve: annual(6, 21),
    effect: null,
    background:
      "bg-gradient-to-b from-sky-100 to-yellow-50 dark:from-sky-950/40 dark:to-yellow-950/30",
    related: ["spring", "autumn"],
  },
  {
    slug: "autumn",
    title: "Autumn",
    category: "season",
    resolve: annual(9, 22),
    effect: "leaves",
    background:
      "bg-gradient-to-b from-orange-100 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30",
    related: ["summer", "winter", "halloween"],
  },
  {
    slug: "winter",
    title: "Winter",
    category: "season",
    resolve: annual(12, 21),
    effect: "snow",
    background:
      "bg-gradient-to-b from-slate-100 to-sky-50 dark:from-slate-950/40 dark:to-sky-950/30",
    related: ["autumn", "christmas"],
  },

  // Sports — fixed known dates (update when new editions are scheduled)
  {
    slug: "fifa-world-cup",
    title: "FIFA World Cup",
    category: "sport",
    resolve: fixedDate("2026-06-11T00:00:00Z"),
    effect: "confetti",
    related: ["olympics", "super-bowl"],
  },
  {
    slug: "olympics",
    title: "Summer Olympics",
    category: "sport",
    resolve: fixedDate("2028-07-14T00:00:00Z"),
    effect: "fireworks",
    related: ["fifa-world-cup", "super-bowl"],
  },
  {
    slug: "super-bowl",
    title: "Super Bowl",
    category: "sport",
    resolve: fixedDate("2027-02-14T00:00:00Z"),
    effect: "confetti",
    related: ["fifa-world-cup", "olympics"],
  },

  // Movies — public schedules at time of writing (may go stale)
  {
    slug: "avatar-3",
    title: "Avatar: Fire and Ash",
    category: "movie",
    resolve: fixedDate("2026-12-19T00:00:00Z"),
    related: ["avengers-doomsday"],
  },
  {
    slug: "avengers-doomsday",
    title: "Avengers: Doomsday",
    category: "movie",
    resolve: fixedDate("2026-12-18T00:00:00Z"),
    related: ["avatar-3"],
  },
  {
    slug: "mission-impossible-final",
    title: "Mission: Impossible — The Final Reckoning",
    category: "movie",
    resolve: fixedDate("2025-05-23T00:00:00Z"),
    related: ["avengers-doomsday"],
  },

  // Games — public schedules at time of writing (may go stale)
  {
    slug: "gta-6",
    title: "Grand Theft Auto VI",
    category: "game",
    resolve: fixedDate("2026-11-19T00:00:00Z"),
    related: ["forza-horizon-6"],
  },
  {
    slug: "forza-horizon-6",
    title: "Forza Horizon 6",
    category: "game",
    resolve: fixedDate("2026-10-15T00:00:00Z"),
    related: ["gta-6"],
  },
  {
    slug: "subnautica-2",
    title: "Subnautica 2",
    category: "game",
    resolve: fixedDate("2025-09-23T00:00:00Z"),
    related: ["gta-6", "forza-horizon-6"],
  },
];

export const categoryLabels: Record<EventCategory, string> = {
  holiday: "Holidays",
  season: "Seasons",
  sport: "Sports",
  movie: "Movies",
  game: "Games",
  other: "Other",
};
