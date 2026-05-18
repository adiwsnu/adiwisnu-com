"use client";

import { useEffect, useState, useCallback } from "react";

export type Favorite = {
  date: string; // YYYY-MM-DD
  label?: string;
};

const KEY = "adiwisnu.days.favorites.v1";

function read(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is Favorite =>
        x && typeof x.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.date),
    );
  } catch {
    return [];
  }
}

function write(list: Favorite[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setFavorites(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((fav: Favorite) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.date === fav.date)) return prev;
      const next = [...prev, fav];
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((date: string) => {
    setFavorites((prev) => {
      const next = prev.filter((p) => p.date !== date);
      write(next);
      return next;
    });
  }, []);

  const has = useCallback(
    (date: string) => favorites.some((p) => p.date === date),
    [favorites],
  );

  return { favorites, ready, add, remove, has };
}
