import type { Metadata } from "next";
import Link from "next/link";
import { DateCalculatorForm } from "@/components/days/date-calculator-form";

export const metadata: Metadata = {
  title: "Date Calculator | Days",
  description: "Calculate the duration between two dates.",
};

export default function DateCalculatorPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          tool
        </p>
        <h1 className="text-2xl tracking-tight">Date Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Pick two dates and see the duration between them.
        </p>
      </header>

      <DateCalculatorForm />

      <footer className="pt-6 border-t border-border">
        <Link
          href="/days"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← all countdowns
        </Link>
      </footer>
    </article>
  );
}
