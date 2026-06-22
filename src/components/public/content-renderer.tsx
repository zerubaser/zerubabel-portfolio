import { cn } from "@/lib/utils";

/**
 * Renders stored plain-text / lightweight-markdown content as readable
 * paragraphs. Splits on blank lines into <p>, preserves single line breaks
 * within a paragraph. Text-only (React escapes it) — no raw HTML is rendered.
 */
export function ContentRenderer({ content, className }: { content: string; className?: string }) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={cn("flex flex-col gap-4 leading-relaxed text-muted-foreground", className)}>
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para}
        </p>
      ))}
    </div>
  );
}
