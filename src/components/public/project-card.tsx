import Link from "next/link";
import { MediaImage } from "./media-image";

type Card = {
  slug: string;
  title: string;
  summary: string;
  featured: boolean;
  category: { name: string } | null;
  images: { url: string; altText: string | null }[];
  techStack: { tech: { name: string } }[];
};

export function ProjectCard({ project }: { project: Card }) {
  const cover = project.images[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur transition-colors hover:border-white/25"
    >
      <div className="aspect-video w-full overflow-hidden bg-white/5">
        <MediaImage
          src={cover?.url}
          alt={cover?.altText ?? project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-3 text-xs">
          {project.category ? <span className="text-sky-400">{project.category.name}</span> : null}
          {project.featured ? <span className="text-orange-400">★ Featured</span> : null}
        </div>
        <h3 className="font-semibold">{project.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t.tech.name} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">
              {t.tech.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
