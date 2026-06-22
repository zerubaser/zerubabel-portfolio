import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    title: "Contact",
    description: "Get in touch about a project or collaboration.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-10">
      <PageHeader title="Contact" description="Tell me about your project — I usually reply within a couple of days." />

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <ContactForm />

        <aside className="flex flex-col gap-4 text-sm">
          {settings?.email ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <a href={`mailto:${settings.email}`} className="rounded-sm hover:text-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">{settings.email}</a>
            </div>
          ) : null}
          {settings?.phone ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
              <span>{settings.phone}</span>
            </div>
          ) : null}
          {settings?.location ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
              <span>{settings.location}</span>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
