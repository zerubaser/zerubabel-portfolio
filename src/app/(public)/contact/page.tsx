import type { Metadata } from "next";
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Contact</h1>
        <p className="mt-2 text-muted-foreground">Tell me about your project — I usually reply within a couple of days.</p>
      </header>

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <ContactForm />

        <aside className="flex flex-col gap-3 text-sm">
          {settings?.email ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
              <a href={`mailto:${settings.email}`} className="hover:text-sky-400">{settings.email}</a>
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
