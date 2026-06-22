import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "PUBLISHED" ? "success" : status === "ARCHIVED" ? "muted" : "warning";
  return <Badge variant={variant}>{status.toLowerCase()}</Badge>;
}

export function VisibilityBadge({ visibility }: { visibility: string }) {
  const variant =
    visibility === "PUBLIC" ? "default" : visibility === "LIMITED" ? "warning" : "danger";
  return <Badge variant={variant}>{visibility.toLowerCase()}</Badge>;
}

export function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) return null;
  return <Badge variant="success">featured</Badge>;
}
