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
  role?: string;
  org?: string;
  location?: string | null;
  startDate?: string;
  endDate?: string;
  description?: string | null;
  order?: number;
  status?: string;
};

export function ExperienceForm({
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
          <Label htmlFor="role">Role *</Label>
          <Input id="role" name="role" defaultValue={values?.role} required />
          <FieldError messages={state?.errors?.role} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org">Organization *</Label>
          <Input id="org" name="org" defaultValue={values?.org} required />
          <FieldError messages={state?.errors?.org} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={values?.location ?? ""} />
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
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={values?.startDate} />
          <FieldError messages={state?.errors?.startDate} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDate">End date (blank = ongoing)</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={values?.endDate} />
          <FieldError messages={state?.errors?.endDate} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={values?.description ?? ""} className="min-h-28" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="order">Order</Label>
        <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} className="max-w-32" />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/experience" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
