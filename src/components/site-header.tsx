import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/days", label: "days" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto w-full max-w-2xl px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-tight hover:text-muted-foreground transition-colors"
        >
          adiwisnu
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
