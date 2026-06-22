import type { Metadata } from "next";
import { SkillGroupForm } from "../skill-group-form";
import { createSkillGroup } from "@/server/actions/skill-groups";

export const metadata: Metadata = { title: "New Skill Group", robots: { index: false, follow: false } };

export default function CreateSkillGroupPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New skill group</h1>
      <SkillGroupForm action={createSkillGroup} />
    </div>
  );
}
