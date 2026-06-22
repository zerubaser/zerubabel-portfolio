import type { Metadata } from "next";
import { CategoryForm } from "../category-form";
import { createCategory } from "@/server/actions/categories";

export const metadata: Metadata = {
  title: "New Category",
  robots: { index: false, follow: false },
};

export default function CreateCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New category</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
