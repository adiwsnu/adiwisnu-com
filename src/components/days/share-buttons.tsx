"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  path: string;
  title: string;
};

export function ShareButtons({ path, title }: Props) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `https://adiwisnu.com${path}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      copy();
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`;
  const mailto = `mailto:?subject=${encodeURIComponent(
    title,
  )}&body=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={copy}>
        {copied ? "copied" : "copy link"}
      </Button>
      <Button variant="outline" size="sm" onClick={nativeShare}>
        share
      </Button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] border border-border px-2.5 text-[0.8rem] hover:bg-muted transition-colors"
      >
        twitter
      </a>
      <a
        href={mailto}
        className="inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] border border-border px-2.5 text-[0.8rem] hover:bg-muted transition-colors"
      >
        email
      </a>
    </div>
  );
}
