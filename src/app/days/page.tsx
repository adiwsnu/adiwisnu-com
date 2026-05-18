import type { Metadata } from "next";
import { DatePickerForm } from "@/components/days/date-picker-form";
import { DateMathForm } from "@/components/days/date-math-form";
import { FavoritesList } from "@/components/days/favorites-list";

export const metadata: Metadata = {
  title: "Days — count to any date",
  description: "Pick a date, get a live countdown. Save favorites locally.",
};

export default function DaysHomePage() {
  return (
    <article className="space-y-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          days
        </p>
        <h1 className="text-2xl tracking-tight">Count to any date.</h1>
        <p className="text-sm text-muted-foreground">
          Pick a date. Future dates count down; past dates count up. Save
          favorites to this device.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          pick a date
        </h2>
        <DatePickerForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
          date math
        </h2>
        <p className="text-xs text-muted-foreground">
          Add or subtract a duration from any date to find a new one.
        </p>
        <DateMathForm />
      </section>

      <FavoritesList />
    </article>
  );
}
