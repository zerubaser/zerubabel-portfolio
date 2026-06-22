import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TagForm } from "../../tag-form";
import { updateTag } from "@/server/actions/tags";

export const metadata: Metadata = { title: "Edit Tag", robots: { index: false, follow: false } };

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit tag</h1>
      <TagForm action={updateTag.bind(null, tag.id)} values={tag} />
    </div>
  );
}
