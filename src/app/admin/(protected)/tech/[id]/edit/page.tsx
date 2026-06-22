import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TechForm } from "../../tech-form";
import { updateTech } from "@/server/actions/tech";

export const metadata: Metadata = {
  title: "Edit Tech",
  robots: { index: false, follow: false },
};

export default async function EditTechPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tech = await prisma.tech.findUnique({ where: { id } });
  if (!tech) notFound();

  const action = updateTech.bind(null, tech.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit tech</h1>
      <TechForm action={action} values={tech} />
    </div>
  );
}
