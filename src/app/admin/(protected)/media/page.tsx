import type { Metadata } from "next";
import { listUploads } from "@/lib/upload";
import { MediaUploader } from "@/components/admin/media-uploader";
import { CopyButton } from "@/components/admin/copy-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMedia } from "@/server/actions/media";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const files = await listUploads();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Media</h1>

      <MediaUploader />

      {error === "in-use" ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          That file is still attached to a project image. Remove it from the
          project first.
        </p>
      ) : null}

      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Uploaded files ({files.length})
      </h2>

      {files.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No uploads yet.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <li key={file.url} className="flex flex-col gap-3 rounded-lg border border-border p-3">
              {file.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-36 w-full rounded-md border border-border object-cover"
                />
              ) : (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-36 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground"
                >
                  PDF — open
                </a>
              )}
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="break-all font-mono">{file.url}</span>
                <span className="text-muted-foreground">
                  {file.folder || "/"} · {formatSize(file.size)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton value={file.url} />
                <DeleteButton action={deleteMedia} id={file.url} name="url" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
