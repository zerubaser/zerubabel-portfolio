import type { Metadata } from "next";
import { TechForm } from "../tech-form";
import { createTech } from "@/server/actions/tech";

export const metadata: Metadata = {
  title: "New Tech",
  robots: { index: false, follow: false },
};

export default function CreateTechPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New tech</h1>
      <TechForm action={createTech} />
    </div>
  );
}
