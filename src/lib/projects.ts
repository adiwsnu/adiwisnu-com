export type Project = {
  slug: string;
  title: string;
  description: string;
  url: string; // e.g. https://editor.adiwisnu.com or /lab/foo
  year: string;
};

// Curated list. Subdomain experiments link out; path-based ones link in.
// Keep entries terse — the index page intentionally shows a sparse list.
export const projects: Project[] = [
  {
    slug: "days",
    title: "days",
    description:
      "A live countdown to any date. Pick a date, get a ticker that counts down (or up, for past dates). Optional time-of-day target via ?t=HH-MM. Date-math form for \"N days/weeks/months/years from X\". Favourites stored in your browser.",
    url: "/days",
    year: "2026",
  },
];
