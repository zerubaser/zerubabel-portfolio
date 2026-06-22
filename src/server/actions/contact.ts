"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";
import { formString, formOptional, type FormState } from "@/lib/form";

// Best-effort in-memory rate limit. Works on the single PM2 process this app
// runs as; for multi-instance setups this should move to Redis (TODO).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const SUCCESS = { ok: true as const, message: "Thanks — your message has been sent." };

/** Public contact form submission (the only public mutation). */
export async function submitContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: bots fill hidden fields. Silently accept so they don't retry.
  if (formString(formData, "company").trim() !== "") {
    return SUCCESS;
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (ip !== "unknown" && isRateLimited(ip)) {
    return { ok: false, message: "Too many messages. Please try again in a minute." };
  }

  const parsed = contactSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    subject: formOptional(formData, "subject"),
    body: formString(formData, "body"),
  });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.message.create({
    data: {
      name: parsed.data.name,
      // Zod has already trimmed name/email/subject/body.
      email: parsed.data.email,
      subject: parsed.data.subject ?? null,
      body: parsed.data.body,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent: h.get("user-agent") ?? null,
    },
  });

  // TODO(email): when SMTP_* env is configured, send a notification here
  // (e.g. via nodemailer/Resend) to CONTACT_TO_EMAIL. Keep it best-effort —
  // a failed send must not lose the saved message. No secrets in code.

  return SUCCESS;
}
