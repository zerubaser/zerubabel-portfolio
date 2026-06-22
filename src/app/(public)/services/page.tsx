import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings, getPublishedServices } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    title: "Services",
    description: "Mobile apps, backend APIs, ERP/SaaS, healthcare systems, WordPress, and full project delivery.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Services</h1>
        <p className="mt-2 text-muted-foreground">What I can build for you.</p>
      </header>

      {services.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-muted-foreground">
          Services will be listed soon.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">{service.title}</h2>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      )}

      <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-orange-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold">Need something custom?</h2>
        <Link href="/contact" className="mt-5 inline-block rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90">
          Get in touch
        </Link>
      </section>
    </div>
  );
}
