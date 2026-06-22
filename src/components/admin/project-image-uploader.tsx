"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createProjectImage } from "@/server/actions/project-images";
import { IMAGE_TYPES } from "@/lib/validators/project-image";

const TYPE_TO_KIND: Record<string, string> = {
  COVER: "cover",
  GALLERY: "gallery",
  SCREENSHOT: "screenshot",
  LOGO: "logo",
  MOCKUP: "mockup",
  PROFILE: "profile",
  OG_IMAGE: "og",
};

export function ProjectImageUploader({
  projectId,
  projectSlug,
}: {
  projectId: string;
  projectSlug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const fields = new FormData(formEl);
    const file = fields.get("file");
    const type = String(fields.get("type") ?? "GALLERY");

    if (!(file instanceof File) || file.size === 0) {
      setError("Choose an image file.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const upload = new FormData();
      upload.set("file", file);
      upload.set("kind", TYPE_TO_KIND[type] ?? "gallery");
      upload.set("prefix", projectSlug);

      const res = await fetch("/api/admin/upload", { method: "POST", body: upload });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      const created = await createProjectImage({
        projectId,
        url: data.url,
        type,
        altText: String(fields.get("altText") ?? "") || undefined,
        caption: String(fields.get("caption") ?? "") || undefined,
        order: Number(fields.get("order") ?? 0) || 0,
      });
      if (created && !created.ok) {
        setError(created.message ?? "Could not save the image.");
        return;
      }

      formEl.reset();
      router.refresh();
    } catch {
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-lg border border-border p-4"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Add image
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pi-file">Image *</Label>
          <Input
            id="pi-file"
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pi-type">Type *</Label>
          <Select id="pi-type" name="type" defaultValue="GALLERY">
            {IMAGE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pi-alt">Alt text</Label>
          <Input id="pi-alt" name="altText" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pi-caption">Caption</Label>
          <Input id="pi-caption" name="caption" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pi-order">Order</Label>
          <Input id="pi-order" name="order" type="number" min={0} defaultValue={0} className="max-w-32" />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div>
        <Button type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Upload & add"}
        </Button>
      </div>
    </form>
  );
}
