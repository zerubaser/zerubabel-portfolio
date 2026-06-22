import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { storeUpload, isAllowedKind, UploadError } from "@/lib/upload";

// Node runtime: needs fs + sharp. Not matched by middleware (only /admin/*),
// so authentication is enforced here directly.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  const kind = form.get("kind");
  const prefix = typeof form.get("prefix") === "string" ? String(form.get("prefix")) : "";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (typeof kind !== "string" || !isAllowedKind(kind)) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing upload target." },
      { status: 400 },
    );
  }

  try {
    const stored = await storeUpload(file, kind, prefix);
    return NextResponse.json({ ok: true, ...stored });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error("Upload failed:", error);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
