"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/admin/field-error";
import { initialFormState, type FormState } from "@/lib/form";

type Values = {
  name?: string;
  slug?: string;
  description?: string | null;
  order?: number;
};

export function SkillGroupForm({
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
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" defaultValue={values?.name} required />
        <FieldError messages={state?.errors?.name} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={values?.slug} placeholder="auto-generated from name if blank" />
        <FieldError messages={state?.errors?.slug} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={values?.description ?? ""} />
        <FieldError messages={state?.errors?.description} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="order">Order</Label>
        <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} className="max-w-32" />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/skill-groups" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
