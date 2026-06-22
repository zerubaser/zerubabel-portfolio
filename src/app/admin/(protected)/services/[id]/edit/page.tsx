import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../../service-form";
import { updateService } from "@/server/actions/services";

export const metadata: Metadata = { title: "Edit Service", robots: { index: false, follow: false } };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit service</h1>
      <ServiceForm action={updateService.bind(null, service.id)} values={service} />
    </div>
  );
}
