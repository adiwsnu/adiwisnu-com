"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/days/favorites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  isoDate: string; // YYYY-MM-DD
  defaultLabel?: string;
};

export function FavoriteToggle({ isoDate, defaultLabel = "" }: Props) {
  const { ready, has, add, remove } = useFavorites();
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(defaultLabel);

  if (!ready) {
    return (
      <Button variant="outline" size="sm" disabled>
        save
      </Button>
    );
  }

  const saved = has(isoDate);

  if (saved) {
    return (
      <Button variant="outline" size="sm" onClick={() => remove(isoDate)}>
        remove from favorites
      </Button>
    );
  }

  if (!editing) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        save to favorites
      </Button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        add({ date: isoDate, label: label.trim() || undefined });
        setEditing(false);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <Input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="optional label"
        className="h-7 max-w-[14rem]"
        autoFocus
      />
      <Button type="submit" size="sm">
        save
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setEditing(false)}
      >
        cancel
      </Button>
    </form>
  );
}
