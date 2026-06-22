import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "../../category-form";
import { updateCategory } from "@/server/actions/categories";

export const metadata: Metadata = {
  title: "Edit Category",
  robots: { index: false, follow: false },
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const action = updateCategory.bind(null, category.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit category</h1>
      <CategoryForm action={action} values={category} />
    </div>
  );
}
