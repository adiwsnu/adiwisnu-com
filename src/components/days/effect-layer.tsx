"use client";

import { useEffect, useState } from "react";
import type { EventEffect } from "@/lib/days/catalogue";

type Props = { effect: EventEffect };

const PARTICLE_COUNT = 40;

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
};

function makeParticles(seed = 1): Particle[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: rand() * 100,
    delay: rand() * 6,
    duration: 6 + rand() * 6,
    size: 6 + rand() * 8,
    drift: (rand() - 0.5) * 40,
  }));
}

const GLYPH: Record<Exclude<EventEffect, null>, string> = {
  snow: "❄",
  confetti: "✦",
  fireworks: "✺",
  hearts: "♥",
  leaves: "❦",
};

const COLOR: Record<Exclude<EventEffect, null>, string> = {
  snow: "text-sky-400/70 dark:text-sky-200/60",
  confetti: "text-pink-500/70 dark:text-pink-300/70",
  fireworks: "text-amber-500/80 dark:text-amber-300/80",
  hearts: "text-rose-500/70 dark:text-rose-300/70",
  leaves: "text-orange-600/70 dark:text-orange-300/70",
};

export function EffectLayer({ effect }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!effect || !mounted) return null;
  const particles = makeParticles();
  const glyph = GLYPH[effect];
  const color = COLOR[effect];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute top-0 ${color} select-none`}
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animation: `days-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          {glyph}
        </span>
      ))}
      <style>{`
        @keyframes days-fall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(var(--drift, 0), 110vh, 0) rotate(360deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
