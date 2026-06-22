/** Shared shape returned by Server Actions to drive form error/pending UI. */
export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
} | null;

export const initialFormState: FormState = null;

/** Read a FormData field as a string ("" when absent or a File). */
export function formString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

/** Read a FormData field as a trimmed string, or undefined when empty. */
export function formOptional(formData: FormData, key: string): string | undefined {
  const v = formString(formData, key).trim();
  return v === "" ? undefined : v;
}

/** Normalize a comma-separated string into a unique, trimmed string[]. */
export function parseKeywords(input: unknown): string[] {
  if (typeof input !== "string") return [];
  const seen = new Set<string>();
  for (const raw of input.split(",")) {
    const k = raw.trim();
    if (k) seen.add(k);
  }
  return [...seen];
}
