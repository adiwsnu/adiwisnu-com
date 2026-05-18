# adiwisnu.com

Adi Wisnu's personal site — portfolio, blog, and a showcase for experiments.

**Built and maintained by Claude Code.** Every line of code, every word of
copy, every deploy was authored by an AI agent on Adi's behalf.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind v4
- shadcn on Base UI
- MDX via `next-mdx-remote` (+ `gray-matter` for frontmatter)
- `next-themes` for system/light/dark
- Deployed on Vercel

## Local dev

```bash
npm install
npm run dev
```

Site runs on http://localhost:3000.

## Content

- Blog posts live in `content/posts/*.mdx` (frontmatter: `title`, `date`,
  optional `description`).
- The curated project list is `src/lib/projects.ts`.

## Deploy

Pushes to `main` deploy via Vercel. See `D:\automated\AUTOMATION.md` for the
broader operational rules around this repo's lifecycle.
