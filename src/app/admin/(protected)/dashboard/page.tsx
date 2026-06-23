import type { Metadata } from "next";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  FileEdit,
  Star,
  Wrench,
  Sparkles,
  FileText,
  Mail,
  Images,
  Plus,
  Upload,
  Settings,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { StatusBadge, VisibilityBadge } from "@/components/admin/badges";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: LucideIcon; accent?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent ?? "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();

  const [
    projectsTotal,
    projectsPublished,
    projectsDraft,
    projectsArchived,
    projectsFeatured,
    servicesCount,
    skillsCount,
    postsCount,
    unread,
    imagesCount,
    byVisibility,
    recentProjects,
    recentMessages,
    recentPosts,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { status: "ARCHIVED" } }),
    prisma.project.count({ where: { featured: true } }),
    prisma.service.count(),
    prisma.skill.count(),
    prisma.post.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.projectImage.count(),
    prisma.project.groupBy({ by: ["visibility"], _count: { _all: true } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, slug: true, status: true, visibility: true } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, subject: true, read: true, createdAt: true } }),
    prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true } }),
  ]);

  const vis = Object.fromEntries(byVisibility.map((r) => [r.visibility, r._count._all]));
  const visPublic = vis.PUBLIC ?? 0;
  const visLimited = vis.LIMITED ?? 0;
  const visConfidential = vis.CONFIDENTIAL ?? 0;

  const quickActions = [
    { href: "/admin/projects/create", label: "Add Project", icon: Plus },
    { href: "/admin/services/create", label: "Add Service", icon: Plus },
    { href: "/admin/blog/create", label: "Add Blog Post", icon: Plus },
    { href: "/admin/media", label: "Upload Media", icon: Upload },
    { href: "/admin/settings", label: "Edit Settings", icon: Settings },
    { href: "/", label: "View Public Site", icon: ExternalLink, external: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {session?.user?.email}. Manage your portfolio content below.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Projects" value={projectsTotal} icon={FolderKanban} />
        <StatCard label="Published" value={projectsPublished} icon={CheckCircle2} accent="bg-green-500/10 text-green-600" />
        <StatCard label="Drafts" value={projectsDraft} icon={FileEdit} accent="bg-amber-500/10 text-amber-600" />
        <StatCard label="Featured" value={projectsFeatured} icon={Star} accent="bg-sky-500/10 text-sky-600" />
        <StatCard label="Unread Messages" value={unread} icon={Mail} accent="bg-rose-500/10 text-rose-600" />
        <StatCard label="Services" value={servicesCount} icon={Wrench} />
        <StatCard label="Skills" value={skillsCount} icon={Sparkles} />
        <StatCard label="Blog Posts" value={postsCount} icon={FileText} />
        <StatCard label="Project Images" value={imagesCount} icon={Images} />
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((a) =>
            a.external ? (
              <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-sm transition-colors hover:border-primary/40 hover:bg-accent">
                <a.icon className="h-5 w-5 text-primary" />
                {a.label}
              </a>
            ) : (
              <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-sm transition-colors hover:border-primary/40 hover:bg-accent">
                <a.icon className="h-5 w-5 text-primary" />
                {a.label}
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Status overview + recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Project status</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Bar label="Published" value={projectsPublished} total={projectsTotal} color="bg-green-500" />
            <Bar label="Draft" value={projectsDraft} total={projectsTotal} color="bg-amber-500" />
            <Bar label="Archived" value={projectsArchived} total={projectsTotal} color="bg-muted-foreground" />
          </div>
          <h2 className="mt-6 text-sm font-semibold">Visibility</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Bar label="Public" value={visPublic} total={projectsTotal} color="bg-sky-500" />
            <Bar label="Limited" value={visLimited} total={projectsTotal} color="bg-amber-500" />
            <Bar label="Confidential" value={visConfidential} total={projectsTotal} color="bg-rose-500" />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent projects</h2>
            <Link href="/admin/projects" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {recentProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/projects/${p.id}/edit`} className="truncate text-sm font-medium hover:underline">{p.title}</Link>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <StatusBadge status={p.status} />
                    <VisibilityBadge visibility={p.visibility} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent messages</h2>
            <Link href="/admin/messages" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}{m.read ? "" : <span className="ml-2 rounded-full bg-amber-500/20 px-1.5 text-xs text-amber-600">new</span>}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.subject || m.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{m.createdAt.toISOString().slice(0, 10)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent blog posts</h2>
            <Link href="/admin/blog" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="truncate text-sm font-medium">{p.title}</span>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
