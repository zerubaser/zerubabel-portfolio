import { cn } from "@/lib/utils";

export function PublicCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur", className)}>
      {children}
    </div>
  );
}
