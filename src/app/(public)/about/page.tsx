import type { Metadata } from "next";
import Link from "next/link";
import { MediaImage } from "@/components/public/media-image";
import { buildMetadata, FALLBACK_DESCRIPTION } from "@/lib/seo";
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
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        {settings?.profileImage ? (
          <MediaImage src={settings.profileImage} alt={settings?.siteName ?? "Profile"} className="h-32 w-32 rounded-2xl border border-white/10 object-cover" />
        ) : null}
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">About</h1>
          {settings?.location ? <p className="mt-1 text-sm text-muted-foreground">{settings.location}</p> : null}
        </div>
      </header>

      <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{bio}</p>

      {settings?.resumeUrl ? (
        <a href={settings.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5">
          Download CV
        </a>
      ) : null}

      {skillGroups.some((g) => g.skills.length > 0) ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      ) : null}

      {experience.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Experience</h2>
          <ol className="mt-4 flex flex-col gap-4 border-l border-white/10 pl-6">
            {experience.map((item) => (
              <li key={item.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium">{item.role} · <span className="text-muted-foreground">{item.org}</span></p>
                  <span className="text-xs text-muted-foreground">{fmtPeriod(item.startDate, item.endDate)}</span>
                </div>
                {item.description ? <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.description}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 to-orange-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold">Let’s work together</h2>
        <Link href="/contact" className="mt-5 inline-block rounded-md bg-gradient-to-r from-sky-500 to-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90">
          Contact me
        </Link>
      </section>
    </div>
  );
}
