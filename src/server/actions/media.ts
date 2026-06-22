"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { deleteUploadByUrl } from "@/lib/upload";
import { formString } from "@/lib/form";

/**
 * Delete a standalone uploaded file by its public URL. Refuses to delete a file
 * that is still referenced by a ProjectImage (avoids orphaning DB rows).
 */
export async function deleteMedia(formData: FormData): Promise<void> {
  await requireAdmin();
  const url = formString(formData, "url");
  if (!url) return;

  const referenced = await prisma.projectImage.count({ where: { url } });
  if (referenced > 0) {
    redirect("/admin/media?error=in-use");
  }

  await deleteUploadByUrl(url);
  revalidatePath("/admin/media");
  redirect("/admin/media");
}
