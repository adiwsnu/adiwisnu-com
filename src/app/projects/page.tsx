import type { Metadata } from "next";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — most live at *.adiwisnu.com.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-2xl tracking-tight">projects</h1>
        <p className="text-muted-foreground">
          Commissioned experiments, built and deployed by Claude Code. Most
          live at their own subdomain; a few live as paths on this site.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">∅</p>
      ) : (
        <ul className="divide-y divide-border">
          {projects.map((p) => (
            <li key={p.slug} className="py-6 first:pt-0 last:pb-0">
              <a href={p.url} className="group block space-y-2">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-base group-hover:text-muted-foreground transition-colors">
                    {p.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {p.year}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
