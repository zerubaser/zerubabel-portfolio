import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/public/section";
import { ProjectCard } from "@/components/public/project-card";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata, FALLBACK_NAME, FALLBACK_DESCRIPTION } from "@/lib/seo";
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

  const heroTitle = settings?.heroTitle || FALLBACK_NAME;
  const heroSubtitle = settings?.heroSubtitle || FALLBACK_DESCRIPTION;
  const bio = settings?.bio;

  return (
    <div className="flex flex-col">
      {/* Hero — placeholder for the future 3D Digital Command Center. */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(56,189,248,0.15),transparent),radial-gradient(40%_40%_at_80%_20%,rgba(251,146,60,0.12),transparent)]" />
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-400">{settings?.title || "Full-Stack Developer"}</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">{heroTitle}</h1>
            <p className="max-w-xl text-balance text-muted-foreground">{heroSubtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects" className="rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
                View projects
              </Link>
              <Link href="/contact" className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5">
                Get in touch
              </Link>
              {settings?.resumeUrl ? (
                <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5">
                  Download CV
                </a>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            {settings?.profileImage ? (
              <MediaImage src={settings.profileImage} alt={heroTitle} className="h-48 w-48 rounded-2xl border border-white/10 object-cover" />
            ) : null}
            <div className="w-full rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-xs text-muted-foreground">
              A 3D “Digital Command Center” hero will live here in a later phase.
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      {bio ? (
        <Section title="About" href="/about" hrefLabel="More about me">
          <p className="max-w-3xl text-muted-foreground">{bio}</p>
        </Section>
      ) : null}

      {/* Featured projects */}
      <Section title="Featured projects" href="/projects" hrefLabel="All projects">
        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-muted-foreground">Projects will be published soon.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </Section>

      {/* Services preview */}
      {services.length > 0 ? (
        <Section title="Services" href="/services">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Skills preview */}
      {skillGroups.length > 0 ? (
        <Section title="Skills" href="/about" hrefLabel="Full breakdown">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.filter((g) => g.skills.length > 0).map((group) => (
              <div key={group.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-sky-400">{group.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span key={skill.id} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Experience preview */}
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

      {/* Testimonials preview */}
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

      {/* Blog preview */}
      {posts.length > 0 ? (
        <Section title="Latest writing" href="/blog" hrefLabel="All posts">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/25">
                <p className="text-xs text-muted-foreground">{post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : ""}</p>
                <h3 className="mt-1 font-semibold">{post.title}</h3>
                {post.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Contact CTA */}
      <section className="my-12 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-orange-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold">Have a system to build?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          From mobile apps to ERP platforms — let’s talk about your project.
        </p>
        <Link href="/contact" className="mt-5 inline-block rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90">
          Start a conversation
        </Link>
      </section>
    </div>
  );
}
