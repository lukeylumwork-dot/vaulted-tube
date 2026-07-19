import { supabase } from "@/integrations/supabase/client";

export const VIDEOS_BUCKET = "videos";

const ensureAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error("You must be logged in to manage video files.");
  return userId;
};

const buildVideoPath = (userId: string, videoId: string, fileName: string) => {
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "mp4";
  const safeExt = (ext || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${userId}/${videoId}-${Date.now()}.${safeExt || "mp4"}`;
};

export async function uploadVideoFileForVideo(videoId: string, file: File) {
  const userId = await ensureAuthenticatedUser();
  const path = buildVideoPath(userId, videoId, file.name);

  const { error } = await supabase.storage.from(VIDEOS_BUCKET).upload(path, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type || "video/mp4",
  });
  if (error) throw error;

  const { data } = supabase.storage.from(VIDEOS_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function getVideoPublicUrl(path: string) {
  const { data } = supabase.storage.from(VIDEOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function resolveVideoSource(video: { videoUrl?: string; videoStoragePath?: string }) {
  if (video.videoUrl) return video.videoUrl;
  if (video.videoStoragePath) return getVideoPublicUrl(video.videoStoragePath);
  return undefined;
}
