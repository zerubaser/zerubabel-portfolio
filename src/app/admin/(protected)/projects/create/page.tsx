import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";
import { createProject } from "@/server/actions/projects";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default async function CreateProjectPage() {
  const [categories, techs] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tech.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New project</h1>
      {categories.length === 0 ? (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm">
          You need at least one{" "}
          <Link href="/admin/categories/create" className="underline">
            category
          </Link>{" "}
          before a project can be saved.
        </p>
      ) : null}
      <ProjectForm action={createProject} categories={categories} techs={techs} />
    </div>
  );
}
