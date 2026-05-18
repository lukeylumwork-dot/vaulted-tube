import { supabase } from "@/integrations/supabase/client";
import { Collection, Performer, Tag, UserPreferences, Video } from "@/types";

export interface CatalogData {
  videos: Video[];
  performers: Performer[];
  tags: Tag[];
  collections: Collection[];
  userPreferences: UserPreferences | null;
}

export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const mapVideo = (row: any): Video => ({
  id: row.id,
  title: row.title,
  performers: row.video_performers?.map((vp: any) => vp.performer_id) ?? [],
  tags: row.video_tags?.map((vt: any) => vt.tag_id) ?? [],
  dateAdded: row.date_added,
  duration: row.duration_seconds,
  rating: row.rating,
  notes: row.notes ?? "",
  isFavorite: row.is_favorite ?? false,
  collections: row.collection_videos?.map((cv: any) => cv.collection_id) ?? [],
  thumbnailColor: row.thumbnail_color ?? "hsl(220 40% 22%)",
  videoUrl: row.video_url ?? undefined,
  videoStoragePath: row.video_storage_path ?? undefined,
  thumbnailUrl: row.thumbnail_url ?? undefined,
  thumbnailStoragePath: row.thumbnail_storage_path ?? undefined,
});

export async function fetchCatalogData(): Promise<CatalogData> {
  const [videosRes, performersRes, tagsRes, collectionsRes, prefsRes] = await Promise.all([
    supabase.from("videos").select("*, video_performers(performer_id), video_tags(tag_id), collection_videos(collection_id)").order("date_added", { ascending: false }),
    supabase.from("performers").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
    supabase.from("collections").select("*, collection_videos(video_id)"),
    supabase.from("user_preferences").select("*").limit(1).maybeSingle(),
  ]);
  if (videosRes.error || performersRes.error || tagsRes.error || collectionsRes.error) throw new Error(videosRes.error?.message || performersRes.error?.message || tagsRes.error?.message || collectionsRes.error?.message);

  return {
    videos: (videosRes.data ?? []).map(mapVideo),
    performers: (performersRes.data ?? []).map((p: any) => ({ ...p, aliases: p.aliases ?? [], tags: p.tags ?? [], videoCount: 0 })),
    tags: (tagsRes.data ?? []).map((t: any) => ({ ...t, videoCount: 0 })),
    collections: (collectionsRes.data ?? []).map((c: any) => ({ ...c, videoIds: c.collection_videos?.map((cv: any) => cv.video_id) ?? [], createdAt: c.created_at })),
    userPreferences: prefsRes.data ? {
      displayName: prefsRes.data.display_name,
      defaultSort: prefsRes.data.default_sort,
      itemsPerRow: prefsRes.data.items_per_row,
    } : null,
  };
}

export async function upsertVideo(video: Video) {
  const { error } = await supabase.from("videos").upsert({
    id: video.id,
    title: video.title,
    date_added: video.dateAdded,
    duration_seconds: video.duration,
    rating: video.rating,
    notes: video.notes,
    is_favorite: video.isFavorite,
    thumbnail_color: video.thumbnailColor,
    video_url: video.videoUrl ?? null,
    video_storage_path: video.videoStoragePath ?? null,
    thumbnail_url: video.thumbnailUrl ?? null,
    thumbnail_storage_path: video.thumbnailStoragePath ?? null,
  });
  if (error) throw error;

  await supabase.from("video_performers").delete().eq("video_id", video.id);
  await supabase.from("video_tags").delete().eq("video_id", video.id);
  await supabase.from("collection_videos").delete().eq("video_id", video.id);
  if (video.performers.length) await supabase.from("video_performers").insert(video.performers.map((performerId) => ({ video_id: video.id, performer_id: performerId })));
  if (video.tags.length) await supabase.from("video_tags").insert(video.tags.map((tagId) => ({ video_id: video.id, tag_id: tagId })));
  if (video.collections.length) await supabase.from("collection_videos").insert(video.collections.map((collectionId) => ({ video_id: video.id, collection_id: collectionId })));
}
