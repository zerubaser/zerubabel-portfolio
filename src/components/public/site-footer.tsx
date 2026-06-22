import Link from "next/link";

export function SiteFooter({
  siteName,
  tagline,
  social,
}: {
  siteName: string;
  tagline?: string | null;
  social?: Record<string, string> | null;
}) {
  const year = new Date().getFullYear();
  const links = social
    ? Object.entries(social).filter(([, v]) => typeof v === "string" && v.length > 0)
    : [];

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{siteName}</p>
          {tagline ? <p className="text-sm text-muted-foreground">{tagline}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {links.map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-foreground">
              {key}
            </a>
          ))}
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-muted-foreground">
        © {year} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
