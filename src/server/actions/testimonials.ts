"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { testimonialSchema } from "@/lib/validators/testimonial";
import { formString, formOptional, type FormState } from "@/lib/form";

function readInput(formData: FormData) {
  return {
    author: formString(formData, "author"),
    role: formOptional(formData, "role"),
    company: formOptional(formData, "company"),
    avatar: formOptional(formData, "avatar"),
    quote: formString(formData, "quote"),
    featured: formData.get("featured") === "on",
    order: formOptional(formData, "order"),
    status: formString(formData, "status"),
  };
}

function toData(d: ReturnType<typeof testimonialSchema.parse>) {
  return {
    author: d.author,
    role: d.role ?? null,
    company: d.company ?? null,
    avatar: d.avatar ?? null,
    quote: d.quote,
    featured: d.featured,
    order: d.order,
    status: d.status,
  };
}

export async function createTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.testimonial.create({ data: toData(parsed.data) });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(readInput(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.testimonial.update({ where: { id }, data: toData(parsed.data) });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}
