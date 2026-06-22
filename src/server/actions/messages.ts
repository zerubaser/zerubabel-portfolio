"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { formString } from "@/lib/form";

export async function toggleMessageRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  const message = await prisma.message.findUnique({ where: { id }, select: { read: true } });
  if (!message) return;
  await prisma.message.update({ where: { id }, data: { read: !message.read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formString(formData, "id");
  if (!id) return;
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
