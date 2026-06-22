import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTech } from "@/server/actions/tech";

export const metadata: Metadata = {
  title: "Tech",
  robots: { index: false, follow: false },
};

export default async function TechPage() {
  const techs = await prisma.tech.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tech</h1>
        <Link href="/admin/tech/create" className={buttonVariants()}>
          New tech
        </Link>
      </div>

      {techs.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No tech yet. Add the technologies you build with.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Color</th>
                <th className="px-4 py-2 font-medium">Projects</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {techs.map((tech) => (
                <tr key={tech.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{tech.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{tech.slug}</td>
                  <td className="px-4 py-2">
                    {tech.color ? (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-border"
                          style={{ backgroundColor: tech.color }}
                        />
                        {tech.color}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{tech._count.projects}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/tech/${tech.id}/edit`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteTech} id={tech.id} />
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
