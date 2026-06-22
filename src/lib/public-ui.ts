// Shared public CTA styles. Centralized so buttons/links stay consistent and
// keyboard-accessible (visible focus ring) across the public site.

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const primaryCta =
  `inline-flex items-center justify-center rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 ${focusRing}`;

export const secondaryCta =
  `inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 ${focusRing}`;

export const linkUnderline =
  `text-sky-400 underline-offset-4 hover:underline ${focusRing} rounded-sm`;
