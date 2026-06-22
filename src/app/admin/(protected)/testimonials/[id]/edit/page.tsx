import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "../../testimonial-form";
import { updateTestimonial } from "@/server/actions/testimonials";

export const metadata: Metadata = { title: "Edit Testimonial", robots: { index: false, follow: false } };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit testimonial</h1>
      <TestimonialForm action={updateTestimonial.bind(null, item.id)} values={item} />
    </div>
  );
}
