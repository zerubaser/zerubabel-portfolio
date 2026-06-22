import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge, VisibilityBadge, FeaturedBadge } from "@/components/admin/badges";
import {
  deleteProject,
  toggleProjectFeatured,
  toggleProjectPublished,
} from "@/server/actions/projects";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/admin/projects/create" className={buttonVariants()}>
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No projects yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">State</th>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{project.title}</div>
                    <div className="text-xs text-muted-foreground">{project.slug}</div>
                  </td>
                  <td className="px-4 py-3">{project.category.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge status={project.status} />
                      <VisibilityBadge visibility={project.visibility} />
                      <FeaturedBadge featured={project.featured} />
                    </div>
                  </td>
                  <td className="px-4 py-3">{project.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <form action={toggleProjectPublished}>
                        <input type="hidden" name="id" value={project.id} />
                        <Button type="submit" variant="outline" size="sm">
                          {project.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                      <form action={toggleProjectFeatured}>
                        <input type="hidden" name="id" value={project.id} />
                        <Button type="submit" variant="outline" size="sm">
                          {project.featured ? "Unfeature" : "Feature"}
                        </Button>
                      </form>
                      <Link
                        href={`/admin/projects/${project.id}/images`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Images
                      </Link>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteProject} id={project.id} confirmMessage="Delete this project? This cannot be undone." />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
