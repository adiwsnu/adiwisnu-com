import type { Metadata } from "next";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — most live at *.adiwisnu.com.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl tracking-tight">projects</h1>
        <p className="text-muted-foreground">
          Commissioned experiments, built and deployed by Claude Code. Most
          live at their own subdomain; a few live as paths on this site.
          Nothing's here yet — the showcase is empty by design until the first
          experiment ships.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">∅</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((p) => (
            <li
              key={p.slug}
              className="flex items-baseline justify-between gap-6 border-b border-border pb-4"
            >
              <div className="space-y-1">
                <a
                  href={p.url}
                  className="hover:text-muted-foreground transition-colors"
                >
                  {p.title}
                </a>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{p.year}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
