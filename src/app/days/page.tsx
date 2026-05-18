import type { Metadata } from "next";
import { DatePickerForm } from "@/components/days/date-picker-form";
import { FavoritesList } from "@/components/days/favorites-list";

export const metadata: Metadata = {
  title: "Days — count to any date",
  description: "Pick a date, get a live countdown. Save favorites locally.",
};

export default function DaysHomePage() {
  return (
    <article className="space-y-10">
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

      <DatePickerForm />

      <FavoritesList />
    </article>
  );
}
