import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkill } from "@/server/actions/skills";

export const metadata: Metadata = { title: "Skills", robots: { index: false, follow: false } };

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { group: { select: { name: true } }, tech: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <Link href="/admin/skills/create" className={buttonVariants()}>New skill</Link>
      </div>
      {skills.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No skills yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Group</th>
                <th className="px-4 py-2 font-medium">Level</th>
                <th className="px-4 py-2 font-medium">Tech</th>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{skill.name}</td>
                  <td className="px-4 py-2">{skill.group.name}</td>
                  <td className="px-4 py-2">{skill.level ?? "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">{skill.tech?.name ?? "—"}</td>
                  <td className="px-4 py-2">{skill.order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/skills/${skill.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <DeleteButton action={deleteSkill} id={skill.id} />
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
