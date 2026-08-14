import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type IssueSignedUploadParams = {
  bucket: string;
  path: string;
  upsert?: boolean;
};

export async function issueSignedUpload(params: IssueSignedUploadParams) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(params.bucket)
    .createSignedUploadUrl(params.path, { upsert: params.upsert ?? false });

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create signed upload URL.");
  }

  return {
    path: data.path,
    token: data.token,
    signedUrl: data.signedUrl,
  };
}

export async function objectExists(bucket: string, path: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const folder = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
  const name = path.includes("/") ? path.slice(path.lastIndexOf("/") + 1) : path;
  const { data, error } = await supabase.storage.from(bucket).list(folder || undefined, {
    search: name,
    limit: 20,
  });
  if (error) return false;
  return (data ?? []).some((obj) => obj.name === name);
}

export function getPublicObjectUrl(bucket: string, path: string): string {
  const supabase = createSupabaseAdminClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
