import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/badges";
import { deleteService } from "@/server/actions/services";

export const metadata: Metadata = { title: "Services", robots: { index: false, follow: false } };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <Link href="/admin/services/create" className={buttonVariants()}>New service</Link>
      </div>
      {services.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No services yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{service.title}</td>
                  <td className="px-4 py-2 text-muted-foreground">{service.slug}</td>
                  <td className="px-4 py-2"><StatusBadge status={service.status} /></td>
                  <td className="px-4 py-2">{service.order}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/services/${service.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>Edit</Link>
                      <DeleteButton action={deleteService} id={service.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
