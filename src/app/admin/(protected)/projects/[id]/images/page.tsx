import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { ProjectImageUploader } from "@/components/admin/project-image-uploader";
import { ProjectImageRow } from "@/components/admin/project-image-row";

export const metadata: Metadata = {
  title: "Project Images",
  robots: { index: false, follow: false },
};

export default async function ProjectImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, title: true, slug: true },
  });
  if (!project) notFound();

  const images = await prisma.projectImage.findMany({
    where: { projectId: id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Images</h1>
          <p className="text-sm text-muted-foreground">{project.title}</p>
        </div>
        <Link
          href={`/admin/projects/${project.id}/edit`}
          className={buttonVariants({ variant: "outline" })}
        >
          Back to project
        </Link>
      </div>

      <ProjectImageUploader projectId={project.id} projectSlug={project.slug} />

      {images.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No images yet. Upload the first one above.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {images.map((image) => (
            <ProjectImageRow key={image.id} image={image} />
          ))}
        </div>
      )}
    </div>
  );
}
