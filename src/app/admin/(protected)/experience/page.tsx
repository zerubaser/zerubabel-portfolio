import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/badges";
import { deleteExperience } from "@/server/actions/experience";

export const metadata: Metadata = { title: "Experience", robots: { index: false, follow: false } };

function fmt(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function ExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Experience</h1>
        <Link href="/admin/experience/create" className={buttonVariants()}>New entry</Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No experience entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Organization</th>
                <th className="px-4 py-2 font-medium">Period</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{item.role}</td>
                  <td className="px-4 py-2">{item.org}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {fmt(item.startDate) || "—"} → {item.endDate ? fmt(item.endDate) : "Present"}
                  </td>
                  <td className="px-4 py-2"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/experience/${item.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <DeleteButton action={deleteExperience} id={item.id} />
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
