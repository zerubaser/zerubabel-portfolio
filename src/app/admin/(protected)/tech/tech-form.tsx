"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialFormState, type FormState } from "@/lib/form";

type Values = {
  name?: string;
  slug?: string;
  icon?: string | null;
  color?: string | null;
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

export function TechForm({
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
        <Label htmlFor="icon">Icon</Label>
        <Input id="icon" name="icon" defaultValue={values?.icon ?? ""} placeholder="icon name or URL" />
        <FieldError messages={state?.errors?.icon} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="color">Color</Label>
        <Input id="color" name="color" defaultValue={values?.color ?? ""} placeholder="#0ea5e9" className="max-w-40" />
        <FieldError messages={state?.errors?.color} />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/tech" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
