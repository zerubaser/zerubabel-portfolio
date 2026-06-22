import type { Metadata } from "next";
import { TestimonialForm } from "../testimonial-form";
import { createTestimonial } from "@/server/actions/testimonials";

export const metadata: Metadata = { title: "New Testimonial", robots: { index: false, follow: false } };

export default function CreateTestimonialPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New testimonial</h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
