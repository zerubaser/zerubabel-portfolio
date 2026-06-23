"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FolderTree,
  Cpu,
  Wrench,
  Layers3,
  Sparkles,
  Briefcase,
  MessageSquareQuote,
  FileText,
  Tags,
  Mail,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: ComponentType<{ className?: string }> };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  { label: "Overview", items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/tech", label: "Tech Stack", icon: Cpu },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/skill-groups", label: "Skill Groups", icon: Layers3 },
      { href: "/admin/skills", label: "Skills", icon: Sparkles },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/blog", label: "Blog Posts", icon: FileText },
      { href: "/admin/tags", label: "Tags", icon: Tags },
    ],
  },
  { label: "Communication", items: [{ href: "/admin/messages", label: "Messages", icon: Mail }] },
  { label: "Assets", items: [{ href: "/admin/media", label: "Media", icon: ImageIcon }] },
  { label: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  unreadCount,
  onNavigate,
  logoutAction,
}: {
  pathname: string;
  unreadCount: number;
  onNavigate?: () => void;
  logoutAction: () => void | Promise<void>;
}) {
  const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin/dashboard"
        onClick={onNavigate}
        className={cn("flex items-center gap-2 border-b border-border px-5 py-4", focus)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">ZS</span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">zerubabel.et</span>
          <span className="text-xs text-muted-foreground">admin</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                        focus,
                        active ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/messages" && unreadCount > 0 ? (
                        <span className="rounded-full bg-amber-500/20 px-1.5 text-xs font-medium text-amber-600">{unreadCount}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mb-2">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Public</p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground", focus)}
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Public Site</span>
          </a>
        </div>
      </nav>

      <form action={logoutAction} className="border-t border-border p-3">
        <button
          type="submit"
          className={cn("flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive", focus)}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log out</span>
        </button>
      </form>
    </div>
  );
}

export function AdminShell({
  email,
  unreadCount,
  logoutAction,
  children,
}: {
  email: string;
  unreadCount: number;
  logoutAction: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = ALL_ITEMS.find((i) => isActive(pathname, i.href))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-card md:block">
        <SidebarNav pathname={pathname} unreadCount={unreadCount} logoutAction={logoutAction} />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card md:hidden">
            <div className="flex justify-end p-2">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-2 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav pathname={pathname} unreadCount={unreadCount} onNavigate={() => setOpen(false)} logoutAction={logoutAction} />
          </aside>
        </>
      ) : null}

      {/* Main column */}
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-border p-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold">{current}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:inline">{email}</span>
            <form action={logoutAction}>
              <button type="submit" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent">Log out</button>
            </form>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
