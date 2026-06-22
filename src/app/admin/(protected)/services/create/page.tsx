import type { Metadata } from "next";
import { ServiceForm } from "../service-form";
import { createService } from "@/server/actions/services";

export const metadata: Metadata = { title: "New Service", robots: { index: false, follow: false } };

export default function CreateServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New service</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
