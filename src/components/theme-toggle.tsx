"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render a placeholder until mounted on client.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground transition-colors"
    >
      {/* size-4 icon, swap visibility based on theme */}
      <Sun
        className={`size-4 ${mounted && !isDark ? "block" : "hidden"}`}
        aria-hidden
      />
      <Moon
        className={`size-4 ${mounted && isDark ? "block" : "hidden"}`}
        aria-hidden
      />
      {/* placeholder while unmounted to reserve space */}
      {!mounted ? <span className="size-4" aria-hidden /> : null}
    </button>
  );
}
