import { supabase } from "@/integrations/supabase/client";
import { Collection, Performer, Tag, UserPreferences, Video } from "@/types";

export interface CatalogData {
  videos: Video[];
  performers: Performer[];
  tags: Tag[];
  collections: Collection[];
  userPreferences: UserPreferences | null;
}

interface VideoRow {
  id: string; title: string; date_added: string; duration_seconds: number;
  rating: number; notes: string | null; is_favorite: boolean | null;
  thumbnail_color: string | null; video_url: string | null;
  video_storage_path: string | null; thumbnail_url: string | null;
  thumbnail_storage_path: string | null;
  video_performers: { performer_id: string }[] | null;
  video_tags: { tag_id: string }[] | null;
  collection_videos: { collection_id: string }[] | null;
}
interface PerformerRow { id: string; name: string; aliases: string[] | null; tags: string[] | null; notes: string | null; avatar_color: string | null; }
interface TagRow { id: string; name: string; category: string; }
interface CollectionRow { id: string; name: string; description: string | null; cover_color: string | null; created_at: string; collection_videos: { video_id: string }[] | null; }

export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const mapVideo = (row: VideoRow): Video => ({
  id: row.id,
  title: row.title,
  performers: row.video_performers?.map((vp) => vp.performer_id) ?? [],
  tags: row.video_tags?.map((vt) => vt.tag_id) ?? [],
  dateAdded: row.date_added,
  duration: row.duration_seconds,
  rating: row.rating,
  notes: row.notes ?? "",
  isFavorite: row.is_favorite ?? false,
  collections: row.collection_videos?.map((cv) => cv.collection_id) ?? [],
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
    videos: (videosRes.data as VideoRow[] ?? []).map(mapVideo),
    performers: (performersRes.data as PerformerRow[] ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      aliases: p.aliases ?? [],
      tags: p.tags ?? [],
      notes: p.notes ?? "",
      avatarColor: p.avatar_color ?? "hsl(220 40% 22%)",
      videoCount: 0,
    })),
    tags: (tagsRes.data as TagRow[] ?? []).map((t) => ({ ...t, videoCount: 0 })),
    collections: (collectionsRes.data as CollectionRow[] ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? "",
      coverColor: c.cover_color ?? "hsl(220 40% 22%)",
      videoIds: c.collection_videos?.map((cv) => cv.video_id) ?? [],
      createdAt: c.created_at,
    })),
    userPreferences: prefsRes.data ? {
      displayName: prefsRes.data.display_name,
      defaultSort: prefsRes.data.default_sort,
      itemsPerRow: prefsRes.data.items_per_row,
    } : null,
  };
}

const requireAuthUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const userId = data.user?.id;
  if (!userId) throw new Error("You must be logged in to save catalog changes.");
  return userId;
};

export async function upsertVideo(video: Video) {
  const ownerId = await requireAuthUserId();

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
    owner_id: ownerId,
    updated_by: ownerId,
  });
  if (error) throw error;

  const videoPerformersDeleteRes = await supabase.from("video_performers").delete().eq("video_id", video.id);
  if (videoPerformersDeleteRes.error) throw videoPerformersDeleteRes.error;

  const videoTagsDeleteRes = await supabase.from("video_tags").delete().eq("video_id", video.id);
  if (videoTagsDeleteRes.error) throw videoTagsDeleteRes.error;

  const collectionVideosDeleteRes = await supabase.from("collection_videos").delete().eq("video_id", video.id);
  if (collectionVideosDeleteRes.error) throw collectionVideosDeleteRes.error;

  if (video.performers.length) {
    const videoPerformersInsertRes = await supabase.from("video_performers").insert(video.performers.map((performerId) => ({ video_id: video.id, performer_id: performerId, owner_id: ownerId })));
    if (videoPerformersInsertRes.error) throw videoPerformersInsertRes.error;
  }

  if (video.tags.length) {
    const videoTagsInsertRes = await supabase.from("video_tags").insert(video.tags.map((tagId) => ({ video_id: video.id, tag_id: tagId, owner_id: ownerId })));
    if (videoTagsInsertRes.error) throw videoTagsInsertRes.error;
  }

  if (video.collections.length) {
    const collectionVideosInsertRes = await supabase.from("collection_videos").insert(video.collections.map((collectionId) => ({ video_id: video.id, collection_id: collectionId, owner_id: ownerId })));
    if (collectionVideosInsertRes.error) throw collectionVideosInsertRes.error;
  }
}
