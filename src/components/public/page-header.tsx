export function PageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      {children}
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-sky-400">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
    </header>
  );
}
