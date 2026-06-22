import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { EmptyState } from "@/components/public/empty-state";
import { ProjectCard } from "@/components/public/project-card";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings, getPublishedProjects } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    title: "Projects",
    description: "Selected work — ERP/SaaS, healthcare, LMS, mobile apps, and business systems.",
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  const byCategory = new Map<string, typeof projects>();
  for (const p of projects) {
    const key = p.category?.name ?? "Other";
    const list = byCategory.get(key) ?? [];
    list.push(p);
    byCategory.set(key, list);
  }

  return (
    <div className="py-10">
      <PageHeader title="Projects" description="Real systems, grouped by what they do." />

      {projects.length === 0 ? (
        <EmptyState>Projects will be published soon.</EmptyState>
      ) : (
        <div className="flex flex-col gap-12">
          {[...byCategory.entries()].map(([category, list]) => (
            <section key={category}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-400">{category}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
