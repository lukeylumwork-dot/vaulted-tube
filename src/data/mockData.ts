import { Video, Performer, Tag, Collection, UserPreferences } from "@/types";

export const performers: Performer[] = [
  { id: "p1", name: "Alex Rivera", aliases: ["A. Rivera"], tags: ["action", "drama"], notes: "Versatile performer", videoCount: 4, avatarColor: "hsl(199 89% 48%)" },
  { id: "p2", name: "Jordan Chen", aliases: ["J. Chen"], tags: ["comedy", "indie"], notes: "Award-winning", videoCount: 3, avatarColor: "hsl(265 70% 60%)" },
  { id: "p3", name: "Sam Taylor", aliases: ["S. Taylor"], tags: ["thriller", "sci-fi"], notes: "Rising talent", videoCount: 3, avatarColor: "hsl(142 71% 45%)" },
  { id: "p4", name: "Morgan Lee", aliases: ["M. Lee"], tags: ["drama", "romance"], notes: "Critically acclaimed", videoCount: 3, avatarColor: "hsl(38 92% 50%)" },
  { id: "p5", name: "Casey Blake", aliases: ["C. Blake"], tags: ["action", "adventure"], notes: "Stunt specialist", videoCount: 2, avatarColor: "hsl(0 72% 51%)" },
  { id: "p6", name: "Riley Park", aliases: ["R. Park"], tags: ["animation", "family"], notes: "Voice actor", videoCount: 2, avatarColor: "hsl(45 93% 58%)" },
];

export const tags: Tag[] = [
  { id: "t1", name: "Action", category: "Genre", videoCount: 4 },
  { id: "t2", name: "Drama", category: "Genre", videoCount: 5 },
  { id: "t3", name: "Comedy", category: "Genre", videoCount: 3 },
  { id: "t4", name: "Sci-Fi", category: "Genre", videoCount: 3 },
  { id: "t5", name: "Thriller", category: "Genre", videoCount: 2 },
  { id: "t6", name: "Romance", category: "Genre", videoCount: 2 },
  { id: "t7", name: "Indie", category: "Genre", videoCount: 3 },
  { id: "t8", name: "Short Film", category: "Format", videoCount: 3 },
  { id: "t9", name: "Feature", category: "Format", videoCount: 5 },
  { id: "t10", name: "Documentary", category: "Format", videoCount: 2 },
  { id: "t11", name: "Animation", category: "Format", videoCount: 1 },
  { id: "t12", name: "Award Winner", category: "Accolade", videoCount: 3 },
  { id: "t13", name: "Director's Cut", category: "Edition", videoCount: 2 },
  { id: "t14", name: "Classic", category: "Era", videoCount: 2 },
  { id: "t15", name: "Recent Release", category: "Era", videoCount: 4 },
];

const placeholderColors = [
  "hsl(199 60% 25%)", "hsl(265 50% 25%)", "hsl(142 50% 20%)",
  "hsl(38 60% 25%)", "hsl(320 50% 25%)", "hsl(170 50% 22%)",
  "hsl(220 40% 22%)", "hsl(15 50% 25%)", "hsl(280 40% 22%)",
  "hsl(90 40% 20%)", "hsl(200 50% 20%)", "hsl(350 40% 25%)",
];

export const videos: Video[] = [
  { id: "v1", title: "Neon Horizon", performers: ["p1", "p3"], tags: ["t1", "t4", "t9", "t15"], dateAdded: "2024-12-15", duration: 7200, rating: 4, notes: "Cyberpunk action epic. Great world-building.", isFavorite: true, collections: ["c1"], thumbnailColor: placeholderColors[0] },
  { id: "v2", title: "The Quiet Room", performers: ["p2", "p4"], tags: ["t2", "t7", "t9", "t12"], dateAdded: "2024-12-10", duration: 5400, rating: 5, notes: "Intimate character study. Sundance selection.", isFavorite: true, collections: ["c1", "c3"], thumbnailColor: placeholderColors[1] },
  { id: "v3", title: "Signal Lost", performers: ["p3"], tags: ["t5", "t4", "t9", "t15"], dateAdded: "2024-12-08", duration: 6600, rating: 4, notes: "Tense space thriller with excellent pacing.", isFavorite: false, collections: ["c1"], thumbnailColor: placeholderColors[2] },
  { id: "v4", title: "Last Laugh", performers: ["p2"], tags: ["t3", "t8"], dateAdded: "2024-11-28", duration: 1800, rating: 3, notes: "Dark comedy short. Quirky but entertaining.", isFavorite: false, collections: ["c2"], thumbnailColor: placeholderColors[3] },
  { id: "v5", title: "Ember Falls", performers: ["p1", "p5"], tags: ["t1", "t2", "t9", "t13"], dateAdded: "2024-11-20", duration: 7800, rating: 5, notes: "Director's cut with extended finale. Masterpiece.", isFavorite: true, collections: ["c1", "c3"], thumbnailColor: placeholderColors[4] },
  { id: "v6", title: "Paper Crane", performers: ["p4", "p6"], tags: ["t6", "t2", "t9", "t14"], dateAdded: "2024-11-15", duration: 6000, rating: 4, notes: "Beautiful period romance. Stunning cinematography.", isFavorite: false, collections: ["c3"], thumbnailColor: placeholderColors[5] },
  { id: "v7", title: "Zero Point", performers: ["p1", "p3"], tags: ["t1", "t4", "t8", "t15"], dateAdded: "2024-11-10", duration: 2400, rating: 3, notes: "Proof-of-concept short. Promising VFX work.", isFavorite: false, collections: ["c2"], thumbnailColor: placeholderColors[6] },
  { id: "v8", title: "Velvet Underground", performers: ["p2", "p4"], tags: ["t2", "t7", "t9", "t12"], dateAdded: "2024-11-05", duration: 5100, rating: 4, notes: "Noir-inspired indie drama.", isFavorite: true, collections: ["c1"], thumbnailColor: placeholderColors[7] },
  { id: "v9", title: "Cloud Walker", performers: ["p6"], tags: ["t11", "t8"], dateAdded: "2024-10-25", duration: 1500, rating: 4, notes: "Beautifully animated short film.", isFavorite: false, collections: ["c2"], thumbnailColor: placeholderColors[8] },
  { id: "v10", title: "Iron Meridian", performers: ["p5", "p1"], tags: ["t1", "t9", "t13", "t14"], dateAdded: "2024-10-15", duration: 8400, rating: 5, notes: "Classic action. Director's cut restoration.", isFavorite: true, collections: ["c1", "c3"], thumbnailColor: placeholderColors[9] },
  { id: "v11", title: "The Understory", performers: ["p4"], tags: ["t2", "t10", "t9", "t12"], dateAdded: "2024-10-01", duration: 5700, rating: 4, notes: "Documentary-drama hybrid. Deeply moving.", isFavorite: false, collections: ["c3"], thumbnailColor: placeholderColors[10] },
  { id: "v12", title: "Static Bloom", performers: ["p3", "p5"], tags: ["t5", "t7", "t8", "t15"], dateAdded: "2024-09-20", duration: 2100, rating: 3, notes: "Experimental thriller short. Polarizing style.", isFavorite: false, collections: ["c2"], thumbnailColor: placeholderColors[11] },
];

export const collections: Collection[] = [
  { id: "c1", name: "Must Watch", description: "Top-tier selections for any mood", videoIds: ["v1", "v2", "v3", "v5", "v8", "v10"], createdAt: "2024-09-01", coverColor: "hsl(199 89% 48%)" },
  { id: "c2", name: "Short Films", description: "Quick watches under 45 minutes", videoIds: ["v4", "v7", "v9", "v12"], createdAt: "2024-09-15", coverColor: "hsl(265 70% 60%)" },
  { id: "c3", name: "Award Winners", description: "Critically acclaimed and festival favorites", videoIds: ["v2", "v5", "v6", "v10", "v11"], createdAt: "2024-10-01", coverColor: "hsl(45 93% 58%)" },
];

export const userPreferences: UserPreferences = {
  displayName: "Curator",
  defaultSort: "dateAdded",
  itemsPerRow: 6,
};

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function getPerformerById(id: string): Performer | undefined {
  return performers.find((p) => p.id === id);
}

export function getTagById(id: string): Tag | undefined {
  return tags.find((t) => t.id === id);
}

export function getVideosByPerformer(performerId: string): Video[] {
  return videos.filter((v) => v.performers.includes(performerId));
}

export function getVideosByTag(tagId: string): Video[] {
  return videos.filter((v) => v.tags.includes(tagId));
}

export function getVideosByCollection(collectionId: string): Video[] {
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return [];
  return videos.filter((v) => col.videoIds.includes(v.id));
}
