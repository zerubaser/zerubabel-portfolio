import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCategory } from "@/server/actions/categories";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/create" className={buttonVariants()}>
          New category
        </Link>
      </div>

      {error === "category-has-projects" ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          That category still has projects. Reassign or delete those projects first.
        </p>
      ) : null}

      {categories.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No categories yet. Create your first one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 font-medium">Projects</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{category.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{category.slug}</td>
                  <td className="px-4 py-2">{category.order}</td>
                  <td className="px-4 py-2">{category._count.projects}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteCategory} id={category.id} />
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
