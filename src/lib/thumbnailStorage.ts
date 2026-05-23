import { supabase } from "@/integrations/supabase/client";

export const THUMBNAILS_BUCKET = "thumbnails";

const ensureAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error("You must be logged in to manage thumbnails.");
  return userId;
};

const buildThumbnailPath = (userId: string, videoId: string, fileName: string) => {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
  const safeExt = (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${userId}/${videoId}-${Date.now()}.${safeExt || "jpg"}`;
};

export async function uploadThumbnailForVideo(videoId: string, file: File) {
  const userId = await ensureAuthenticatedUser();
  const path = buildThumbnailPath(userId, videoId, file.name);

  const { error } = await supabase.storage.from(THUMBNAILS_BUCKET).upload(path, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;

  const { data } = supabase.storage.from(THUMBNAILS_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function getThumbnailPublicUrl(path: string) {
  const { data } = supabase.storage.from(THUMBNAILS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
