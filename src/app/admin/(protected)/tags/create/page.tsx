import type { Metadata } from "next";
import { TagForm } from "../tag-form";
import { createTag } from "@/server/actions/tags";

export const metadata: Metadata = { title: "New Tag", robots: { index: false, follow: false } };

export default function CreateTagPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New tag</h1>
      <TagForm action={createTag} />
    </div>
  );
}
