import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings, getPublicProjectBySlug } from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getPublicProjectBySlug(slug),
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
      <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{content}</p>
    </section>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) notFound();

  // PUBLIC + not flagged confidential → full case study; otherwise limited.
  const showFull = project.visibility === "PUBLIC" && !project.isConfidential;

  const cover = project.images.find((i) => i.type === "COVER") ?? project.images[0];
  const gallery = showFull
    ? project.images.filter((i) => i.id !== cover?.id)
    : [];

  const metrics =
    showFull && project.impactMetrics && typeof project.impactMetrics === "object" && !Array.isArray(project.impactMetrics)
      ? Object.entries(project.impactMetrics as Record<string, unknown>)
      : [];

  return (
    <article className="py-10">
      <Link href="/projects" className="text-sm text-sky-400 hover:underline">← All projects</Link>

      <header className="mt-4">
        {project.category ? <p className="text-sm text-sky-400">{project.category.name}</p> : null}
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{project.summary}</p>
      </header>

      {cover ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <MediaImage src={cover.url} alt={cover.altText ?? project.title} className="max-h-[480px] w-full object-cover" />
        </div>
      ) : null}

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Type" value={project.projectType} />
        <Fact label="Industry" value={project.industry} />
        <Fact label="Role" value={project.myRole} />
        <Fact label="Category" value={project.category?.name} />
      </dl>

      {project.techStack.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tech stack</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <span key={t.tech.slug} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted-foreground">{t.tech.name}</span>
            ))}
          </div>
        </div>
      ) : null}

      {!showFull ? (
        <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          This project is shown with limited detail to respect client confidentiality.
        </p>
      ) : null}

      {showFull ? (
        <div className="mt-8 flex flex-col gap-8">
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
                    <dd className="mt-1 text-xl font-semibold">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {gallery.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold">Gallery</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {gallery.map((img) => (
                  <figure key={img.id} className="overflow-hidden rounded-xl border border-white/10">
                    <MediaImage src={img.url} alt={img.altText ?? project.title} className="w-full object-cover" />
                    {img.caption ? <figcaption className="p-2 text-xs text-muted-foreground">{img.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {project.liveUrl || project.githubUrl ? (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
                  Visit live site
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5">
                  View code
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
