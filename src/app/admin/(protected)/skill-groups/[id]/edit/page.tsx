import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillGroupForm } from "../../skill-group-form";
import { updateSkillGroup } from "@/server/actions/skill-groups";

export const metadata: Metadata = { title: "Edit Skill Group", robots: { index: false, follow: false } };

export default async function EditSkillGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await prisma.skillGroup.findUnique({ where: { id } });
  if (!group) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit skill group</h1>
      <SkillGroupForm action={updateSkillGroup.bind(null, group.id)} values={group} />
    </div>
  );
}
