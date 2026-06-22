/**
 * Renders an uploaded/external image as a plain <img> (Rule 5: no Next image
 * optimization for uploaded media). Falls back to a placeholder when missing.
 */
export function MediaImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt?: string | null;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 text-xs text-muted-foreground ${className ?? ""}`}
        aria-hidden="true"
      >
        No image
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} className={className} />;
}
