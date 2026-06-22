"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FieldError } from "@/components/admin/field-error";
import { initialFormState, type FormState } from "@/lib/form";

type Option = { id: string; name: string };

type Values = {
  name?: string;
  level?: number | null;
  icon?: string | null;
  order?: number;
  groupId?: string;
  techId?: string | null;
};

export function SkillForm({
  action,
  groups,
  techs,
  values,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  groups: Option[];
  techs: Option[];
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
        <Label htmlFor="groupId">Group *</Label>
        <Select id="groupId" name="groupId" defaultValue={values?.groupId ?? ""} required>
          <option value="" disabled>
            Select a group…
          </option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
        <FieldError messages={state?.errors?.groupId} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="level">Level (0–100)</Label>
          <Input id="level" name="level" type="number" min={0} max={100} defaultValue={values?.level ?? ""} />
          <FieldError messages={state?.errors?.level} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" name="icon" defaultValue={values?.icon ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="techId">Tech (optional)</Label>
        <Select id="techId" name="techId" defaultValue={values?.techId ?? ""}>
          <option value="">— none —</option>
          {techs.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Link href="/admin/skills" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
