"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/admin/field-error";
import { initialFormState } from "@/lib/form";
import { submitContactMessage } from "@/server/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, initialFormState);

  if (state?.ok) {
    return (
      <p role="status" aria-live="polite" className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-sm">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4" noValidate>
      {/* Honeypot — hidden from humans; bots that fill it are silently dropped. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" autoComplete="name" required aria-invalid={!!state?.errors?.name} />
          <FieldError messages={state?.errors?.name} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!state?.errors?.email} />
          <FieldError messages={state?.errors?.email} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" />
        <FieldError messages={state?.errors?.subject} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Message *</Label>
        <Textarea id="body" name="body" required aria-invalid={!!state?.errors?.body} className="min-h-32" />
        <FieldError messages={state?.errors?.body} />
      </div>

      <div aria-live="polite">
        {state && !state.ok && state.message ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
      </div>

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
