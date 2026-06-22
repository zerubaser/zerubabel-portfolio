import { readFile } from "node:fs/promises";
import { resolveSegmentsToPath, contentTypeForName } from "@/lib/upload";

/**
 * DEV-ONLY convenience: serve files from UPLOAD_DIR at /uploads/*.
 *
 * In production, Nginx serves /uploads/ directly and intercepts these requests
 * before they reach Next.js, so this handler never runs there. Production must
 * NOT depend on it. Read-only, path-traversal-guarded, allowed extensions only.
 */
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const abs = resolveSegmentsToPath(segments);
  if (!abs) return new Response("Not found", { status: 404 });

  const contentType = contentTypeForName(abs);
  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(abs);
    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
