"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FieldError } from "@/components/admin/field-error";
import { initialFormState, type FormState } from "@/lib/form";

type Values = {
  title?: string;
  slug?: string;
  description?: string;
  icon?: string | null;
  order?: number;
  status?: string;
};

export function ServiceForm({
  action,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values?: Values;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" defaultValue={values?.title} required />
        <FieldError messages={state?.errors?.title} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={values?.slug} placeholder="auto-generated from title if blank" />
        <FieldError messages={state?.errors?.slug} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={values?.description} required className="min-h-28" />
        <FieldError messages={state?.errors?.description} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" defaultValue={values?.icon ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} className="max-w-32" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue={values?.status ?? "DRAFT"}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <FieldError messages={state?.errors?.status} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/services" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
