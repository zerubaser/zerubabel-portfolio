import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { TechBadge } from "@/components/public/tech-badge";
import { ContentRenderer } from "@/components/public/content-renderer";
import { ProjectGallery } from "@/components/public/project-gallery";
import { MediaImage } from "@/components/public/media-image";
import { JsonLd } from "@/components/public/json-ld";
import { buildMetadata, resolveSiteUrl } from "@/lib/seo";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/structured-data";
import { primaryCta, secondaryCta } from "@/lib/public-ui";
import { getSiteSettings, getPublicProjectViewBySlug } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getPublicProjectViewBySlug(slug),
  ]);
  if (!project) return { title: "Not found", robots: { index: false } };
  return buildMetadata({
    settings,
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.summary,
    image: project.ogImage,
    canonical: project.canonicalUrl,
    keywords: project.keywords,
    path: `/projects/${project.slug}`,
  });
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function Block({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ContentRenderer content={content} className="mt-2" />
    </section>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getPublicProjectViewBySlug(slug),
  ]);
  if (!project) notFound();

  const base = resolveSiteUrl(settings).replace(/\/$/, "");
  const { showFull } = project;

  const metrics =
    project.impactMetrics && typeof project.impactMetrics === "object" && !Array.isArray(project.impactMetrics)
      ? Object.entries(project.impactMetrics as Record<string, unknown>)
      : [];

  return (
    <article className="py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(
            [
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.title, path: `/projects/${project.slug}` },
            ],
            base,
          ),
          creativeWorkJsonLd(
            {
              title: project.title,
              slug: project.slug,
              summary: project.summary,
              keywords: project.keywords,
              ogImage: project.ogImage,
              category: project.category,
              images: project.cover ? [{ url: project.cover.url }] : [],
            },
            base,
          ),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />

      <header>
        {project.category ? <p className="text-sm text-sky-400">{project.category.name}</p> : null}
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{project.summary}</p>
      </header>

      {project.cover ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <MediaImage src={project.cover.url} alt={project.cover.altText ?? `${project.title} cover`} className="max-h-[480px] w-full object-cover" />
        </div>
      ) : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Type" value={project.projectType} />
        <Fact label="Industry" value={project.industry} />
        <Fact label="Role" value={project.myRole} />
        <Fact label="Category" value={project.category?.name} />
      </dl>

      {project.techStack.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tech stack</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.techStack.map((t) => <TechBadge key={t.tech.slug}>{t.tech.name}</TechBadge>)}
          </div>
        </div>
      ) : null}

      {!showFull ? (
        <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm" role="note">
          This project is shown with limited detail to respect client confidentiality.
        </p>
      ) : null}

      {showFull ? (
        <div className="mt-10 flex flex-col gap-10">
          <Block title="Problem" content={project.problem} />
          <Block title="Solution" content={project.solution} />
          <Block title="Features" content={project.features} />
          <Block title="Outcome" content={project.outcome} />

          {metrics.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold">Impact</h2>
              <dl className="mt-3 grid gap-4 sm:grid-cols-3">
                {metrics.map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-2xl font-semibold">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <ProjectGallery images={project.gallery} title={project.title} />

          {project.liveUrl || project.githubUrl ? (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={primaryCta}>Visit live site</a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={secondaryCta}>View code</a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
