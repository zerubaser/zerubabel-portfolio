"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DeleteButton } from "@/components/admin/delete-button";
import { initialFormState } from "@/lib/form";
import { IMAGE_TYPES } from "@/lib/validators/project-image";
import { updateProjectImage, deleteProjectImage } from "@/server/actions/project-images";

type Image = {
  id: string;
  url: string;
  altText: string | null;
  caption: string | null;
  type: string;
  order: number;
};

export function ProjectImageRow({ image }: { image: Image }) {
  const update = updateProjectImage.bind(null, image.id);
  const [state, action, pending] = useActionState(update, initialFormState);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row">
      {/* Uploaded media is served by Nginx (prod) / the dev route — not optimized by next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.altText ?? ""}
        className="h-32 w-32 shrink-0 rounded-md border border-border object-cover"
      />

      <form action={action} className="flex flex-1 flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`type-${image.id}`}>Type</Label>
            <Select id={`type-${image.id}`} name="type" defaultValue={image.type}>
              {IMAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`order-${image.id}`}>Order</Label>
            <Input
              id={`order-${image.id}`}
              name="order"
              type="number"
              min={0}
              defaultValue={image.order}
              className="max-w-32"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`alt-${image.id}`}>Alt text</Label>
            <Input id={`alt-${image.id}`} name="altText" defaultValue={image.altText ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`caption-${image.id}`}>Caption</Label>
            <Input id={`caption-${image.id}`} name="caption" defaultValue={image.caption ?? ""} />
          </div>
        </div>

        <p className="break-all font-mono text-xs text-muted-foreground">{image.url}</p>

        {state?.errors?.order ? (
          <p className="text-sm text-destructive">{state.errors.order[0]}</p>
        ) : null}
        {state?.ok ? <p className="text-sm text-green-600">Saved.</p> : null}

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
          <DeleteButton
            action={deleteProjectImage}
            id={image.id}
            label="Delete image"
            confirmMessage="Delete this image and its file? This cannot be undone."
          />
        </div>
      </form>
    </div>
  );
}
