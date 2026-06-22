import { MediaImage } from "./media-image";

export function ProjectGallery({
  images,
  title,
}: {
  images: { id: string; url: string; altText: string | null; caption: string | null }[];
  title: string;
}) {
  if (images.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold">Gallery</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {images.map((img) => (
          <figure key={img.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <MediaImage src={img.url} alt={img.altText ?? `${title} screenshot`} className="aspect-video w-full object-cover" />
            {img.caption ? <figcaption className="p-2 text-xs text-muted-foreground">{img.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
