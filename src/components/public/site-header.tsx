"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" onClick={() => setOpen(false)} className="text-sm font-semibold tracking-tight">
          {siteName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1 rounded-md border border-white/10 p-2 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="block h-0.5 w-5 bg-foreground" />
          <span className="block h-0.5 w-5 bg-foreground" />
        </button>
      </div>
      {open ? (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
