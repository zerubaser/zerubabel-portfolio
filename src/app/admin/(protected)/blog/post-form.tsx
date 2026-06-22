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

type Option = { id: string; name: string };

type Values = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  status?: string;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
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

export function PostForm({
  action,
  tags,
  values,
  selectedTagIds = [],
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  tags: Option[];
  values?: Values;
  selectedTagIds?: string[];
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const errors = state?.errors;
  const selected = new Set(selectedTagIds);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <Section title="Content">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" defaultValue={values?.title} required />
          <FieldError messages={errors?.title} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={values?.slug} placeholder="auto-generated from title if blank" />
          <FieldError messages={errors?.slug} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" defaultValue={values?.excerpt} />
          <FieldError messages={errors?.excerpt} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Content (Markdown) *</Label>
          <Textarea id="content" name="content" defaultValue={values?.content} required className="min-h-60 font-mono text-xs" />
          <FieldError messages={errors?.content} />
        </div>
        <MediaUrlField name="coverImage" label="Cover image" defaultValue={values?.coverImage ?? ""} kind="cover" prefix={values?.slug ?? "post"} />
        <FieldError messages={errors?.coverImage} />
      </Section>

      <Section title="Publishing">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={values?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
            <FieldError messages={errors?.status} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="publishedAt">Published at (blank = now on publish)</Label>
            <Input id="publishedAt" name="publishedAt" type="date" defaultValue={values?.publishedAt} />
            <FieldError messages={errors?.publishedAt} />
          </div>
        </div>
      </Section>

      <Section title="Tags">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags yet. Create tags first to attach them.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={selected.has(tag.id)} className="h-4 w-4 rounded border-input" />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section title="SEO">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={values?.metaTitle} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Textarea id="metaDescription" name="metaDescription" defaultValue={values?.metaDescription} />
        </div>
        <MediaUrlField name="ogImage" label="OG image" defaultValue={values?.ogImage ?? ""} kind="og" prefix={values?.slug ?? "post"} />
        <FieldError messages={errors?.ogImage} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="canonicalUrl">Canonical URL</Label>
          <Input id="canonicalUrl" name="canonicalUrl" type="url" defaultValue={values?.canonicalUrl} />
          <FieldError messages={errors?.canonicalUrl} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input id="keywords" name="keywords" defaultValue={values?.keywords} placeholder="nextjs, prisma" />
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save post"}
        </Button>
        <Link href="/admin/blog" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
