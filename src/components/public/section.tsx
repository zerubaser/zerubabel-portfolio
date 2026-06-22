import Link from "next/link";

export function Section({
  title,
  subtitle,
  href,
  hrefLabel = "View all",
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {href ? (
          <Link href={href} className="shrink-0 text-sm text-sky-400 hover:underline">
            {hrefLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
