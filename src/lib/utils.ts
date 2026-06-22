import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unicode combining diacritical marks (U+0300–U+036F), built from an ASCII
// source string so the file stays free of literal combining characters.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

/** Convert arbitrary text into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
