import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  description?: string;
  author?: string;
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Normalize whatever gray-matter gave us for `date` into "yyyy-mm-dd".
 * Unquoted YAML dates get parsed into Date objects; quoted ones come through
 * as strings. Accept both, reject anything else.
 */
function normalizeDate(raw: unknown): string {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, "0");
    const d = String(raw.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  return "";
}

/**
 * Format an ISO date (yyyy-mm-dd) as "Tuesday, 19 May 2026". Posts carry
 * date-only values, so this is a pure calendar mapping — no time or
 * timezone is shown.
 */
export function formatPostDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const probe = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
  const weekday = WEEKDAYS[probe.getUTCDay()];
  return `${weekday}, ${day} ${MONTHS[month - 1]} ${year}`;
}

export type Post = PostMeta & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

async function readPostFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(POSTS_DIR);
    return entries.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await readPostFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.mdx?$/, "");
      return {
        slug,
        title: String(data.title ?? slug),
        date: normalizeDate(data.date),
        description: data.description ? String(data.description) : undefined,
        author: data.author ? String(data.author) : undefined,
      } satisfies PostMeta;
    }),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const files = await readPostFiles();
  const file = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;
  const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: data.description ? String(data.description) : undefined,
    author: data.author ? String(data.author) : undefined,
    content,
  };
}
