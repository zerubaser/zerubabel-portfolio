"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const KINDS = [
  { value: "cover", label: "Project cover" },
  { value: "gallery", label: "Project gallery" },
  { value: "screenshot", label: "Project screenshot" },
  { value: "logo", label: "Project logo" },
  { value: "mockup", label: "Project mockup" },
  { value: "profile", label: "Profile" },
  { value: "og", label: "OG image" },
  { value: "resume", label: "Resume / document (PDF)" },
];

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: new FormData(formEl),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setResult({ url: data.url, size: data.size });
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="media-file">File *</Label>
          <Input
            id="media-file"
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="media-kind">Target *</Label>
          <Select id="media-kind" name="kind" defaultValue="gallery" required>
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result ? (
        <p className="break-all text-sm text-muted-foreground">
          Uploaded ({Math.round(result.size / 1024)} KB):{" "}
          <span className="font-mono text-foreground">{result.url}</span>
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Images (jpg/png/webp, ≤5 MB) are converted to WebP. PDF (≤10 MB) is
        allowed only for the resume/document target. SVG is blocked.
      </p>
    </form>
  );
}
