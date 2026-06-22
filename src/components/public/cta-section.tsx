import Link from "next/link";
import { primaryCta } from "@/lib/public-ui";

export function CTASection({
  title,
  subtitle,
  ctaLabel = "Get in touch",
  ctaHref = "/contact",
}: {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="my-14 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-orange-500/10 p-8 text-center sm:p-12">
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{subtitle}</p> : null}
      <Link href={ctaHref} className={`mt-6 ${primaryCta}`}>
        {ctaLabel}
      </Link>
    </section>
  );
}
