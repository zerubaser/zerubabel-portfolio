"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * URL text field with an inline uploader. Typed or uploaded — either way the
 * value is submitted via a real <input name=...> so it works inside any form.
 */
export function MediaUrlField({
  name,
  label,
  defaultValue = "",
  kind,
  accept = ".jpg,.jpeg,.png,.webp",
  prefix = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  kind: string;
  accept?: string;
  prefix?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", kind);
      fd.set("prefix", prefix);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setValue(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  const isPdf = value.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="/uploads/… or paste a URL"
      />
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={accept}
          onChange={onPick}
          disabled={busy}
          className="text-xs"
        />
        {busy ? <span className="text-xs text-muted-foreground">Uploading…</span> : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {value && isPdf ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline"
        >
          Open PDF
        </a>
      ) : null}
      {value && !isPdf ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-20 w-20 rounded-md border border-border object-cover"
        />
      ) : null}
    </div>
  );
}
