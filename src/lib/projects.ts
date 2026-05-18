export type Project = {
  slug: string;
  title: string;
  description: string;
  url: string; // e.g. https://editor.adiwisnu.com or /lab/foo
  year: string;
};

// Curated list. Subdomain experiments link out; path-based ones link in.
// Keep entries terse — the index page intentionally shows a sparse list.
export const projects: Project[] = [];
