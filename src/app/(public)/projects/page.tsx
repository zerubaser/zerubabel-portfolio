import type { Metadata } from "next";
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

  // Group by category for simple browsing.
  const byCategory = new Map<string, typeof projects>();
  for (const p of projects) {
    const key = p.category?.name ?? "Other";
    const list = byCategory.get(key) ?? [];
    list.push(p);
    byCategory.set(key, list);
  }

  return (
    <div className="py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Projects</h1>
        <p className="mt-2 text-muted-foreground">Real systems, grouped by what they do.</p>
      </header>

      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-muted-foreground">
          Projects will be published soon.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
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
