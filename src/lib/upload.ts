import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile, unlink, stat, readdir } from "node:fs/promises";
import sharp from "sharp";

/** Upload targets, each mapped to a subfolder under UPLOAD_DIR. */
export type UploadKind =
  | "cover"
  | "gallery"
  | "screenshot"
  | "logo"
  | "mockup"
  | "profile"
  | "og"
  | "resume";

const FOLDERS: Record<UploadKind, string> = {
  cover: "projects/covers",
  gallery: "projects/gallery",
  screenshot: "projects/screenshots",
  logo: "projects/logos",
  mockup: "projects/mockups",
  profile: "profile",
  og: "og",
  resume: "resume",
};

/** Map the ProjectImage.type enum to an upload target folder. */
export const IMAGE_TYPE_TO_KIND: Record<string, UploadKind> = {
  COVER: "cover",
  GALLERY: "gallery",
  SCREENSHOT: "screenshot",
  LOGO: "logo",
  MOCKUP: "mockup",
  PROFILE: "profile",
  OG_IMAGE: "og",
};

const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const PDF_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_WIDTH = 1920;

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp"]);
const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

/** Raised for any validation/safety failure; surfaced to the client as 400. */
export class UploadError extends Error {}

export function isAllowedKind(value: string): value is UploadKind {
  return Object.prototype.hasOwnProperty.call(FOLDERS, value);
}

/** Absolute on-disk root for uploads (env-driven; falls back to <cwd>/uploads). */
export function uploadDir(): string {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  return fromEnv ? path.resolve(fromEnv) : path.join(process.cwd(), "uploads");
}

function ext(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

/** Magic-byte sniff to defend against spoofed extensions / MIME. */
function sniff(buf: Buffer): "jpeg" | "png" | "webp" | "pdf" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "png";
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  if (buf.length >= 5 && buf.toString("ascii", 0, 5) === "%PDF-") return "pdf";
  return null;
}

function safeName(prefix: string, extension: string): string {
  const now = new Date();
  const stamp =
    `${now.getUTCFullYear()}` +
    `${String(now.getUTCMonth() + 1).padStart(2, "0")}` +
    `${String(now.getUTCDate()).padStart(2, "0")}`;
  const rand = randomBytes(5).toString("hex");
  const base =
    prefix
      .replace(/[^a-z0-9-]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "file";
  return `${base}-${stamp}-${rand}.${extension}`;
}

/** Assert that `target` resolves to a location inside `baseDir`. */
function ensureWithin(baseDir: string, target: string): string {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(target);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new UploadError("Resolved path escapes the upload directory.");
  }
  return resolved;
}

export type StoredFile = {
  url: string; // origin-relative "/uploads/<folder>/<name>"
  filename: string;
  folder: string;
  size: number;
  contentType: string;
};

/**
 * Validate, process, and persist an uploaded file. Images are re-encoded to
 * WebP (resized to <=1920px wide); PDFs are stored as-is and only allowed for
 * the resume target. Returns an origin-relative public URL — never a disk path.
 */
export async function storeUpload(
  file: File,
  kind: UploadKind,
  namePrefix: string,
): Promise<StoredFile> {
  if (!isAllowedKind(kind)) throw new UploadError("Invalid upload target.");

  const declaredExt = ext(file.name);
  const declaredMime = file.type || "";
  const input = Buffer.from(await file.arrayBuffer());
  if (input.length === 0) throw new UploadError("File is empty.");

  const sniffed = sniff(input);
  const isPdfRequest = declaredExt === "pdf" || declaredMime === "application/pdf";

  let outBuffer: Buffer;
  let outExt: string;
  let contentType: string;

  if (isPdfRequest) {
    if (kind !== "resume") {
      throw new UploadError("PDF files are only allowed for resume/document uploads.");
    }
    if (declaredExt !== "pdf") throw new UploadError("A .pdf extension is required.");
    if (declaredMime && declaredMime !== "application/pdf") {
      throw new UploadError("Invalid PDF MIME type.");
    }
    if (sniffed !== "pdf") throw new UploadError("File content is not a valid PDF.");
    if (input.length > PDF_MAX_BYTES) throw new UploadError("PDF exceeds the 10 MB limit.");
    outBuffer = input;
    outExt = "pdf";
    contentType = "application/pdf";
  } else {
    if (declaredMime === "image/svg+xml" || declaredExt === "svg") {
      throw new UploadError("SVG files are not allowed.");
    }
    if (!IMAGE_EXTS.has(declaredExt)) {
      throw new UploadError("Unsupported image type. Allowed: jpg, jpeg, png, webp.");
    }
    // Reject a mismatched image/* MIME (e.g. image/gif, image/tiff). A generic
    // application/octet-stream or empty type is allowed — some browsers send it
    // for .webp — because the extension + magic-byte sniff below still validate
    // the real content.
    if (declaredMime.startsWith("image/") && !IMAGE_MIMES.has(declaredMime)) {
      throw new UploadError("Unsupported image MIME type.");
    }
    if (!sniffed || sniffed === "pdf") {
      throw new UploadError("File content is not a valid image.");
    }
    if (input.length > IMAGE_MAX_BYTES) throw new UploadError("Image exceeds the 5 MB limit.");

    try {
      outBuffer = await sharp(input)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      throw new UploadError("Invalid or unreadable image file.");
    }
    outExt = "webp";
    contentType = "image/webp";
  }

  const folder = FOLDERS[kind];
  const dir = ensureWithin(uploadDir(), path.join(uploadDir(), folder));
  await mkdir(dir, { recursive: true });

  const filename = safeName(namePrefix, outExt);
  const absPath = ensureWithin(uploadDir(), path.join(dir, filename));
  await writeFile(absPath, outBuffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
    folder,
    size: outBuffer.length,
    contentType,
  };
}

/** Map a public "/uploads/..." URL to a safe absolute path, or null. */
export function resolvePublicUrlToPath(publicUrl: string): string | null {
  if (!publicUrl.startsWith("/uploads/")) return null;
  let rel: string;
  try {
    rel = decodeURIComponent(publicUrl.slice("/uploads/".length));
  } catch {
    return null;
  }
  if (!rel || rel.includes("..") || rel.includes("\0")) return null;
  try {
    return ensureWithin(uploadDir(), path.join(uploadDir(), rel));
  } catch {
    return null;
  }
}

/** Map already-decoded URL path segments to a safe absolute path, or null. */
export function resolveSegmentsToPath(segments: string[]): string | null {
  if (
    segments.length === 0 ||
    segments.some(
      (s) =>
        s === "" ||
        s === "." ||
        s === ".." ||
        s.includes("\0") ||
        s.includes("/") ||
        s.includes("\\"),
    )
  ) {
    return null;
  }
  try {
    return ensureWithin(uploadDir(), path.join(uploadDir(), ...segments));
  } catch {
    return null;
  }
}

export function contentTypeForName(name: string): string | null {
  return CONTENT_TYPES[ext(name)] ?? null;
}

/** Delete a physical upload by its public URL. Only touches files under UPLOAD_DIR. */
export async function deleteUploadByUrl(publicUrl: string): Promise<boolean> {
  const abs = resolvePublicUrlToPath(publicUrl);
  if (!abs) return false; // external or unsafe -> never touch
  try {
    await unlink(abs);
    return true;
  } catch {
    return false; // already gone
  }
}

export type UploadedEntry = {
  url: string;
  folder: string;
  name: string;
  size: number;
  modified: number;
  isImage: boolean;
};

/** Walk UPLOAD_DIR and return uploaded files (newest first), capped. */
export async function listUploads(maxEntries = 500): Promise<UploadedEntry[]> {
  const root = uploadDir();
  const out: UploadedEntry[] = [];

  async function walk(dir: string, rel: string): Promise<void> {
    if (out.length >= maxEntries) return;
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (out.length >= maxEntries) return;
      const abs = path.join(dir, entry.name);
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(abs, childRel);
      } else if (entry.isFile()) {
        const st = await stat(abs).catch(() => null);
        if (!st) continue;
        const folder = childRel.includes("/")
          ? childRel.slice(0, childRel.lastIndexOf("/"))
          : "";
        out.push({
          url: `/uploads/${childRel}`,
          folder,
          name: entry.name,
          size: st.size,
          modified: st.mtimeMs,
          isImage: ext(entry.name) !== "pdf",
        });
      }
    }
  }

  await walk(root, "");
  out.sort((a, b) => b.modified - a.modified);
  return out;
}
