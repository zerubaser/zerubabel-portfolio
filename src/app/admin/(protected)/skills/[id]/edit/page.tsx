import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "../../skill-form";
import { updateSkill } from "@/server/actions/skills";

export const metadata: Metadata = { title: "Edit Skill", robots: { index: false, follow: false } };

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [skill, groups, techs] = await Promise.all([
    prisma.skill.findUnique({ where: { id } }),
    prisma.skillGroup.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tech.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!skill) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit skill</h1>
      <SkillForm action={updateSkill.bind(null, skill.id)} groups={groups} techs={techs} values={skill} />
    </div>
  );
}
