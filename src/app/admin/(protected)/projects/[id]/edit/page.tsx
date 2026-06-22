import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../../project-form";
import { updateProject } from "@/server/actions/projects";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

function toDateInput(value: Date | null): string | undefined {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, categories, techs] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { techStack: { select: { techId: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tech.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!project) notFound();

  const values = {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description ?? undefined,
    clientName: project.clientName ?? undefined,
    projectType: project.projectType ?? undefined,
    industry: project.industry ?? undefined,
    myRole: project.myRole ?? undefined,
    startDate: toDateInput(project.startDate),
    endDate: toDateInput(project.endDate),
    problem: project.problem ?? undefined,
    solution: project.solution ?? undefined,
    features: project.features ?? undefined,
    outcome: project.outcome ?? undefined,
    impactMetrics:
      project.impactMetrics == null
        ? undefined
        : JSON.stringify(project.impactMetrics, null, 2),
    liveUrl: project.liveUrl ?? undefined,
    githubUrl: project.githubUrl ?? undefined,
    ogImage: project.ogImage ?? undefined,
    canonicalUrl: project.canonicalUrl ?? undefined,
    isConfidential: project.isConfidential,
    visibility: project.visibility,
    featured: project.featured,
    status: project.status,
    order: project.order,
    metaTitle: project.metaTitle ?? undefined,
    metaDescription: project.metaDescription ?? undefined,
    keywords: project.keywords.join(", "),
    categoryId: project.categoryId,
  };

  const action = updateProject.bind(null, project.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        action={action}
        categories={categories}
        techs={techs}
        values={values}
        selectedTechIds={project.techStack.map((t) => t.techId)}
      />
    </div>
  );
}
