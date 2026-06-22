import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../../experience-form";
import { updateExperience } from "@/server/actions/experience";

export const metadata: Metadata = { title: "Edit Experience", robots: { index: false, follow: false } };

function toDateInput(d: Date | null): string | undefined {
  return d ? d.toISOString().slice(0, 10) : undefined;
}

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();

  const values = {
    role: item.role,
    org: item.org,
    location: item.location,
    startDate: toDateInput(item.startDate),
    endDate: toDateInput(item.endDate),
    description: item.description,
    order: item.order,
    status: item.status,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit experience</h1>
      <ExperienceForm action={updateExperience.bind(null, item.id)} values={values} />
    </div>
  );
}
