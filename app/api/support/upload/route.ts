import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPublicObjectUrl, issueSignedUpload } from "@/lib/storage-signed-upload";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/jpg", "application/pdf"]);
const BUCKET_NAME = "support-attachments";
const MAX_FILES = 3;

const fileMetaSchema = z.object({
  contentType: z.string().min(1),
  fileSize: z.number().int().positive(),
});

const issueSchema = z.object({
  action: z.literal("issue"),
  files: z.array(fileMetaSchema).min(1).max(MAX_FILES),
});

const completeSchema = z.object({
  action: z.literal("complete"),
  paths: z.array(z.string().min(1)).min(1).max(MAX_FILES),
});

const bodySchema = z.discriminatedUnion("action", [issueSchema, completeSchema]);

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please log in to upload files." }, { status: 401 });
    }

    const raw = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();
    const { error: bucketError } = await admin.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: [...ALLOWED_TYPES],
    });
    if (bucketError && !bucketError.message.includes("already exists")) {
      return NextResponse.json(
        { error: "Failed to upload file. Please ensure the storage bucket is configured." },
        { status: 500 },
      );
    }

    if (parsed.data.action === "issue") {
      for (const file of parsed.data.files) {
        if (!ALLOWED_TYPES.has(file.contentType)) {
          return NextResponse.json(
            { error: `File type ${file.contentType} not allowed. Only JPG, PNG, and PDF are supported.` },
            { status: 400 },
          );
        }
        if (file.fileSize > MAX_FILE_SIZE) {
          return NextResponse.json({ error: "A file exceeds the 5MB limit." }, { status: 400 });
        }
      }

      const uploads = [];
      for (const file of parsed.data.files) {
        const ext =
          file.contentType === "application/pdf"
            ? "pdf"
            : file.contentType === "image/png"
              ? "png"
              : "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const signed = await issueSignedUpload({ bucket: BUCKET_NAME, path });
        uploads.push({
          path: signed.path,
          signedUrl: signed.signedUrl,
          token: signed.token,
          contentType: file.contentType,
        });
      }

      return NextResponse.json({ data: { uploads } });
    }

    // complete — return public URLs for ticket attachments (schema stores URL strings)
    const urls: string[] = [];
    for (const path of parsed.data.paths) {
      if (!path.startsWith(`${user.id}/`)) {
        return NextResponse.json({ error: "Invalid attachment path." }, { status: 400 });
      }
      urls.push(getPublicObjectUrl(BUCKET_NAME, path));
    }

    return NextResponse.json({
      data: { urls },
      message: `${urls.length} file(s) uploaded successfully`,
    });
  } catch (error) {
    console.error("POST /api/support/upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload files" },
      { status: 500 },
    );
  }
}
