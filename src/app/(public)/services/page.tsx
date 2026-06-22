import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { EmptyState } from "@/components/public/empty-state";
import { CTASection } from "@/components/public/cta-section";
import { PublicCard } from "@/components/public/public-card";
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
      <PageHeader title="Services" description="What I can build for you." />

      {services.length === 0 ? (
        <EmptyState>Services will be listed soon.</EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <PublicCard key={service.id} className="flex flex-col gap-2">
              <h2 className="font-semibold">{service.title}</h2>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </PublicCard>
          ))}
        </div>
      )}

      <CTASection title="Need something custom?" subtitle="Tell me what you’re building and I’ll help you ship it." />
    </div>
  );
}
