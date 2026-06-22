import type { Metadata } from "next";
import { ExperienceForm } from "../experience-form";
import { createExperience } from "@/server/actions/experience";

export const metadata: Metadata = { title: "New Experience", robots: { index: false, follow: false } };

export default function CreateExperiencePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New experience</h1>
      <ExperienceForm action={createExperience} />
    </div>
  );
}
