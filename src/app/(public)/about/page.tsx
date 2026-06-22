import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";
import { CTASection } from "@/components/public/cta-section";
import { ContentRenderer } from "@/components/public/content-renderer";
import { TechBadge } from "@/components/public/tech-badge";
import { PublicCard } from "@/components/public/public-card";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata, FALLBACK_DESCRIPTION } from "@/lib/seo";
import { secondaryCta } from "@/lib/public-ui";
import {
  getSiteSettings,
  getSkillGroupsWithSkills,
  getPublishedExperience,
} from "@/server/repositories/public-site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    settings,
    title: "About",
    description: settings?.bio || FALLBACK_DESCRIPTION,
    path: "/about",
  });
}

function fmtPeriod(start: Date | null, end: Date | null): string {
  const y = (d: Date) => d.getUTCFullYear();
  if (!start && !end) return "";
  return `${start ? y(start) : ""} – ${end ? y(end) : "Present"}`;
}

export default async function AboutPage() {
  const [settings, skillGroups, experience] = await Promise.all([
    getSiteSettings(),
    getSkillGroupsWithSkills(),
    getPublishedExperience(),
  ]);

  const bio = settings?.bio || FALLBACK_DESCRIPTION;

  return (
    <div className="py-10">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        {settings?.profileImage ? (
          <MediaImage src={settings.profileImage} alt={settings?.siteName ?? "Profile"} className="h-32 w-32 shrink-0 rounded-2xl border border-white/10 object-cover" />
        ) : null}
        <PageHeader title="About" description={settings?.location ?? undefined} />
      </div>

      <ContentRenderer content={bio} className="max-w-3xl text-base" />

      {settings?.resumeUrl ? (
        <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className={`mt-6 ${secondaryCta}`}>
          Download CV
        </a>
      ) : null}

      {skillGroups.some((g) => g.skills.length > 0) ? (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.filter((g) => g.skills.length > 0).map((group) => (
              <PublicCard key={group.id}>
                <h3 className="text-sm font-semibold text-sky-400">{group.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => <TechBadge key={skill.id}>{skill.name}</TechBadge>)}
                </div>
              </PublicCard>
            ))}
          </div>
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Experience</h2>
          <ol className="mt-4 flex flex-col gap-5 border-l border-white/10 pl-6">
            {experience.map((item) => (
              <li key={item.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{item.role} · <span className="text-muted-foreground">{item.org}</span></p>
                  <span className="text-xs text-muted-foreground">{fmtPeriod(item.startDate, item.endDate)}</span>
                </div>
                {item.description ? <ContentRenderer content={item.description} className="mt-1 text-sm" /> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <CTASection title="Let’s work together" ctaLabel="Contact me" />
    </div>
  );
}
