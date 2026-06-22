export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
