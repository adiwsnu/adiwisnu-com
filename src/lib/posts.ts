import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  description?: string;
};

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
        date: String(data.date ?? ""),
        description: data.description ? String(data.description) : undefined,
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
    content,
  };
}
