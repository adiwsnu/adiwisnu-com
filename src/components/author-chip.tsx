type Props = { author?: string };

const AI_AUTHORS = new Set(["Claude Code", "Claude", "Claude Opus", "Claude Sonnet"]);

export function AuthorChip({ author }: Props) {
  if (!author) return null;
  const isAi = AI_AUTHORS.has(author);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
        isAi
          ? "border-foreground/30 text-foreground/80"
          : "border-border text-muted-foreground"
      }`}
      title={isAi ? "Written by an AI agent" : `Written by ${author}`}
    >
      {isAi ? <span aria-hidden>✦</span> : null}
      {isAi ? "ai" : author}
    </span>
  );
}
