"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FieldError } from "@/components/admin/field-error";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { initialFormState, type FormState } from "@/lib/form";

type Values = {
  author?: string;
  role?: string | null;
  company?: string | null;
  avatar?: string | null;
  quote?: string;
  featured?: boolean;
  order?: number;
  status?: string;
};

export function TestimonialForm({
  action,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values?: Values;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="author">Author *</Label>
          <Input id="author" name="author" defaultValue={values?.author} required />
          <FieldError messages={state?.errors?.author} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" defaultValue={values?.role ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={values?.company ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} className="max-w-32" />
        </div>
      </div>

      <MediaUrlField name="avatar" label="Avatar" defaultValue={values?.avatar ?? ""} kind="profile" prefix="avatar" />
      <FieldError messages={state?.errors?.avatar} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quote">Quote *</Label>
        <Textarea id="quote" name="quote" defaultValue={values?.quote} required className="min-h-28" />
        <FieldError messages={state?.errors?.quote} />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={values?.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={values?.featured} className="h-4 w-4 rounded border-input" />
          Featured
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/testimonials" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
