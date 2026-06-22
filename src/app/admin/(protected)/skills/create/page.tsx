import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "../skill-form";
import { createSkill } from "@/server/actions/skills";

export const metadata: Metadata = { title: "New Skill", robots: { index: false, follow: false } };

export default async function CreateSkillPage() {
  const [groups, techs] = await Promise.all([
    prisma.skillGroup.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tech.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New skill</h1>
      {groups.length === 0 ? (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm">
          Create a <Link href="/admin/skill-groups/create" className="underline">skill group</Link> first.
        </p>
      ) : null}
      <SkillForm action={createSkill} groups={groups} techs={techs} />
    </div>
  );
}
