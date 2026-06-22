import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/public/section";
import { ProjectCard } from "@/components/public/project-card";
import { Hero3DLazy } from "@/components/public/hero-3d-lazy";
import { CTASection } from "@/components/public/cta-section";
import { EmptyState } from "@/components/public/empty-state";
import { TechBadge } from "@/components/public/tech-badge";
import { PublicCard } from "@/components/public/public-card";
import { JsonLd } from "@/components/public/json-ld";
import { buildMetadata, resolveSiteUrl, FALLBACK_NAME, FALLBACK_DESCRIPTION } from "@/lib/seo";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { primaryCta, secondaryCta } from "@/lib/public-ui";
import {
  getSiteSettings,
  getFeaturedProjects,
  getPublishedServices,
  getSkillGroupsWithSkills,
  getPublishedExperience,
  getPublishedTestimonials,
  getPublishedPosts,
} from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({ settings, path: "/" });
}

function fmtPeriod(start: Date | null, end: Date | null): string {
  const y = (d: Date) => d.getUTCFullYear();
  if (!start && !end) return "";
  return `${start ? y(start) : ""} – ${end ? y(end) : "Present"}`;
}

export default async function HomePage() {
  const [settings, featured, services, skillGroups, experience, testimonials, posts] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedProjects(6),
      getPublishedServices(),
      getSkillGroupsWithSkills(),
      getPublishedExperience(),
      getPublishedTestimonials(3),
      getPublishedPosts(),
    ]);

  const base = resolveSiteUrl(settings).replace(/\/$/, "");
  const heroTitle = settings?.heroTitle || FALLBACK_NAME;
  const heroSubtitle = settings?.heroSubtitle || FALLBACK_DESCRIPTION;
  const bio = settings?.bio;

  return (
    <div className="flex flex-col">
      <JsonLd data={[personJsonLd(settings, base), websiteJsonLd(settings, base)]} />

      {/* Hero — placeholder for the future 3D Digital Command Center. */}
      <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="hero-heading">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(56,189,248,0.15),transparent),radial-gradient(40%_40%_at_80%_20%,rgba(251,146,60,0.12),transparent)]" />
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400">{settings?.title || "Full-Stack Developer"}</p>
            <h1 id="hero-heading" className="text-4xl font-bold leading-tight sm:text-6xl">{heroTitle}</h1>
            <p className="max-w-xl text-balance text-lg text-muted-foreground">{heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects" className={primaryCta}>View projects</Link>
              <Link href="/contact" className={secondaryCta}>Get in touch</Link>
              {settings?.resumeUrl ? (
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className={secondaryCta}>Download CV</a>
              ) : null}
            </div>
          </div>
          {/* 3D Digital Command Center — lazy, client-only, with static fallback.
              Decorative: the H1/subtitle/CTAs above carry all SEO content. */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Hero3DLazy />
          </div>
        </div>
      </section>

      {bio ? (
        <Section title="About" href="/about" hrefLabel="More about me">
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{bio}</p>
        </Section>
      ) : null}

      <Section title="Featured projects" href="/projects" hrefLabel="All projects">
        {featured.length === 0 ? (
          <EmptyState>Projects will be published soon.</EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </Section>

      {services.length > 0 ? (
        <Section title="Services" href="/services">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <PublicCard key={s.id}>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
              </PublicCard>
            ))}
          </div>
        </Section>
      ) : null}

      {skillGroups.some((g) => g.skills.length > 0) ? (
        <Section title="Skills" href="/about" hrefLabel="Full breakdown">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.filter((g) => g.skills.length > 0).map((group) => (
              <PublicCard key={group.id}>
                <h3 className="text-sm font-semibold text-sky-400">{group.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => <TechBadge key={skill.id}>{skill.name}</TechBadge>)}
                </div>
              </PublicCard>
            ))}
          </div>
        </Section>
      ) : null}

      {experience.length > 0 ? (
        <Section title="Experience" href="/about" hrefLabel="Timeline">
          <ul className="flex flex-col gap-3">
            {experience.slice(0, 4).map((item) => (
              <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-muted-foreground">{item.org}{item.location ? ` · ${item.location}` : ""}</p>
                </div>
                <span className="text-xs text-muted-foreground">{fmtPeriod(item.startDate, item.endDate)}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {testimonials.length > 0 ? (
        <Section title="Testimonials">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <blockquote className="text-sm text-muted-foreground">“{t.quote}”</blockquote>
                <figcaption className="text-sm font-medium">
                  {t.author}
                  {t.role || t.company ? <span className="text-muted-foreground"> · {[t.role, t.company].filter(Boolean).join(", ")}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {posts.length > 0 ? (
        <Section title="Latest writing" href="/blog" hrefLabel="All posts">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <p className="text-xs text-muted-foreground">{post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : ""}</p>
                <h3 className="mt-1 font-semibold">{post.title}</h3>
                {post.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CTASection
        title="Have a system to build?"
        subtitle="From mobile apps to ERP platforms — let’s talk about your project."
        ctaLabel="Start a conversation"
      />
    </div>
  );
}
