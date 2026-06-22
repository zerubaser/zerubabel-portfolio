"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { initialFormState, type FormState } from "@/lib/form";

type Option = { id: string; name: string };

type Values = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  clientName?: string;
  projectType?: string;
  industry?: string;
  myRole?: string;
  startDate?: string;
  endDate?: string;
  problem?: string;
  solution?: string;
  features?: string;
  outcome?: string;
  impactMetrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  ogImage?: string;
  canonicalUrl?: string;
  isConfidential?: boolean;
  visibility?: string;
  featured?: boolean;
  status?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  categoryId?: string;
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-sm text-destructive">{messages[0]}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ProjectForm({
  action,
  categories,
  techs,
  values,
  selectedTechIds = [],
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  categories: Option[];
  techs: Option[];
  values?: Values;
  selectedTechIds?: string[];
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const errors = state?.errors;
  const selected = new Set(selectedTechIds);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <Section title="Basics">
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
          <Label htmlFor="summary">Summary *</Label>
          <Textarea id="summary" name="summary" defaultValue={values?.summary} required />
          <FieldError messages={errors?.summary} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category *</Label>
          <Select id="categoryId" name="categoryId" defaultValue={values?.categoryId ?? ""} required>
            <option value="" disabled>
              Select a category…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError messages={errors?.categoryId} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={values?.description} className="min-h-32" />
          <FieldError messages={errors?.description} />
        </div>
      </Section>

      <Section title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clientName">Client</Label>
            <Input id="clientName" name="clientName" defaultValue={values?.clientName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectType">Project type</Label>
            <Input id="projectType" name="projectType" defaultValue={values?.projectType} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" defaultValue={values?.industry} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="myRole">My role</Label>
            <Input id="myRole" name="myRole" defaultValue={values?.myRole} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" name="startDate" type="date" defaultValue={values?.startDate} />
            <FieldError messages={errors?.startDate} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endDate">End date</Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={values?.endDate} />
            <FieldError messages={errors?.endDate} />
          </div>
        </div>
      </Section>

      <Section title="Case study">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="problem">Problem</Label>
          <Textarea id="problem" name="problem" defaultValue={values?.problem} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="solution">Solution</Label>
          <Textarea id="solution" name="solution" defaultValue={values?.solution} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="features">Features</Label>
          <Textarea id="features" name="features" defaultValue={values?.features} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="outcome">Outcome</Label>
          <Textarea id="outcome" name="outcome" defaultValue={values?.outcome} />
        </div>
      </Section>

      <Section title="Metrics & links">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="impactMetrics">Impact metrics (JSON)</Label>
          <Textarea
            id="impactMetrics"
            name="impactMetrics"
            defaultValue={values?.impactMetrics}
            placeholder={'{ "students": 1000, "employers": 200 }'}
            className="font-mono text-xs"
          />
          <FieldError messages={errors?.impactMetrics} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input id="liveUrl" name="liveUrl" type="url" defaultValue={values?.liveUrl} />
            <FieldError messages={errors?.liveUrl} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" type="url" defaultValue={values?.githubUrl} />
            <FieldError messages={errors?.githubUrl} />
          </div>
        </div>
      </Section>

      <Section title="Tech stack">
        {techs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tech defined yet. Add tech first to attach it to projects.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {techs.map((tech) => (
              <label key={tech.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="techIds"
                  value={tech.id}
                  defaultChecked={selected.has(tech.id)}
                  className="h-4 w-4 rounded border-input"
                />
                {tech.name}
              </label>
            ))}
          </div>
        )}
      </Section>

      <Section title="Status & visibility">
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
            <Label htmlFor="visibility">Visibility</Label>
            <Select id="visibility" name="visibility" defaultValue={values?.visibility ?? "PUBLIC"}>
              <option value="PUBLIC">Public</option>
              <option value="LIMITED">Limited</option>
              <option value="CONFIDENTIAL">Confidential</option>
            </Select>
            <FieldError messages={errors?.visibility} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order">Order</Label>
            <Input id="order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} className="max-w-32" />
            <FieldError messages={errors?.order} />
          </div>
        </div>
        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={values?.featured} className="h-4 w-4 rounded border-input" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isConfidential" defaultChecked={values?.isConfidential} className="h-4 w-4 rounded border-input" />
            Confidential
          </label>
        </div>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ogImage">OG image URL</Label>
            <Input id="ogImage" name="ogImage" type="url" defaultValue={values?.ogImage} />
            <FieldError messages={errors?.ogImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input id="canonicalUrl" name="canonicalUrl" type="url" defaultValue={values?.canonicalUrl} />
            <FieldError messages={errors?.canonicalUrl} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="keywords">Keywords (comma-separated)</Label>
          <Input id="keywords" name="keywords" defaultValue={values?.keywords} placeholder="laravel, mysql, lms" />
        </div>
      </Section>

      {state?.message ? <p className="text-sm text-destructive">{state.message}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save project"}
        </Button>
        <Link href="/admin/projects" className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
