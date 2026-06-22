"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/admin/field-error";
import { MediaUrlField } from "@/components/admin/media-url-field";
import { initialFormState, type FormState } from "@/lib/form";
import { updateSettings } from "@/server/actions/settings";

type Values = {
  siteName?: string;
  siteUrl?: string;
  title?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  profileImage?: string | null;
  resumeUrl?: string | null;
  socialLinks?: string;
  defaultMetaTitle?: string | null;
  defaultMetaDescription?: string | null;
  defaultOgImage?: string | null;
  keywords?: string;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function SettingsForm({ values }: { values: Values }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    updateSettings,
    initialFormState,
  );
  const errors = state?.errors;

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <Section title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="siteName">Site name *</Label>
            <Input id="siteName" name="siteName" defaultValue={values.siteName} required />
            <FieldError messages={errors?.siteName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="siteUrl">Site URL *</Label>
            <Input id="siteUrl" name="siteUrl" type="url" defaultValue={values.siteUrl} required />
            <FieldError messages={errors?.siteUrl} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={values.title ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={values.location ?? ""} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={values.bio ?? ""} className="min-h-28" />
        </div>
      </Section>

      <Section title="Hero">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heroTitle">Hero title</Label>
          <Input id="heroTitle" name="heroTitle" defaultValue={values.heroTitle ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="heroSubtitle">Hero subtitle</Label>
          <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={values.heroSubtitle ?? ""} />
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={values.email ?? ""} />
            <FieldError messages={errors?.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={values.phone ?? ""} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="socialLinks">Social links (JSON)</Label>
          <Textarea
            id="socialLinks"
            name="socialLinks"
            defaultValue={values.socialLinks}
            placeholder={'{ "github": "https://github.com/...", "linkedin": "https://..." }'}
            className="font-mono text-xs"
          />
          <FieldError messages={errors?.socialLinks} />
        </div>
      </Section>

      <Section title="Media">
        <MediaUrlField name="profileImage" label="Profile image" defaultValue={values.profileImage ?? ""} kind="profile" prefix="profile" />
        <FieldError messages={errors?.profileImage} />
        <MediaUrlField name="resumeUrl" label="Resume (PDF)" defaultValue={values.resumeUrl ?? ""} kind="resume" accept=".pdf" prefix="zerubabel-cv" />
        <FieldError messages={errors?.resumeUrl} />
        <MediaUrlField name="defaultOgImage" label="Default OG image" defaultValue={values.defaultOgImage ?? ""} kind="og" prefix="og-default" />
        <FieldError messages={errors?.defaultOgImage} />
      </Section>

      <Section title="Default SEO">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="defaultMetaTitle">Default meta title</Label>
          <Input id="defaultMetaTitle" name="defaultMetaTitle" defaultValue={values.defaultMetaTitle ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="defaultMetaDescription">Default meta description</Label>
          <Textarea id="defaultMetaDescription" name="defaultMetaDescription" defaultValue={values.defaultMetaDescription ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input id="keywords" name="keywords" defaultValue={values.keywords} />
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
        {state?.ok ? <span className="text-sm text-green-600">{state.message}</span> : null}
      </div>
    </form>
  );
}
