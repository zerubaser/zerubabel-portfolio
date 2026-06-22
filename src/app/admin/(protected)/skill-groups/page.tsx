import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSkillGroup } from "@/server/actions/skill-groups";

export const metadata: Metadata = { title: "Skill Groups", robots: { index: false, follow: false } };

export default async function SkillGroupsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const groups = await prisma.skillGroup.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { skills: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Skill groups</h1>
        <Link href="/admin/skill-groups/create" className={buttonVariants()}>New group</Link>
      </div>
      {error === "group-has-skills" ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          That group still has skills. Reassign or delete those skills first.
        </p>
      ) : null}
      {groups.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No skill groups yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 font-medium">Skills</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{group.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{group.slug}</td>
                  <td className="px-4 py-2">{group.order}</td>
                  <td className="px-4 py-2">{group._count.skills}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/skill-groups/${group.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <DeleteButton action={deleteSkillGroup} id={group.id} />
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
