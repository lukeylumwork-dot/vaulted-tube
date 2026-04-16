import { Video } from "@/types";
import { UserPrefs } from "@/context/UserPrefsContext";

export interface RecommendationSignals {
  prefs: UserPrefs;
  favoriteVideoIds: string[];
}

/**
 * Score a single video against the user's signals.
 * Higher is better. Called once per video during sort.
 */
function scoreVideo(
  video: Video,
  prefs: UserPrefs,
  favoriteVideoIds: string[],
  likedTagIds: Set<string>,
  likedPerformerIds: Set<string>
): number {
  let score = video.rating; // 1–5 base

  // Strong explicit signals
  if (favoriteVideoIds.includes(video.id)) score += 4;
  if (prefs.likedVideoIds.includes(video.id)) score += 3;

  // Onboarding tag interests
  for (const tagId of prefs.onboardingTagIds) {
    if (video.tags.includes(tagId)) score += 2;
  }

  // Onboarding performer interests
  for (const perfId of prefs.onboardingPerformerIds) {
    if (video.performers.includes(perfId)) score += 2;
  }

  // Favourite performers
  for (const perfId of prefs.favoritePerformerIds) {
    if (video.performers.includes(perfId)) score += 1.5;
  }

  // Similarity boost: tags shared with liked/favourited content
  for (const tagId of likedTagIds) {
    if (video.tags.includes(tagId)) score += 0.75;
  }

  // Similarity boost: performers shared with liked/favourited content
  for (const perfId of likedPerformerIds) {
    if (video.performers.includes(perfId)) score += 0.75;
  }

  // Watch penalty — recently watched items rank lower
  // watchedVideoIds is ordered oldest-first, newest at end (index length-1)
  const watchIdx = prefs.watchedVideoIds.indexOf(video.id);
  if (watchIdx >= 0) {
    const recency = (watchIdx + 1) / prefs.watchedVideoIds.length; // 0→oldest, 1→newest
    score -= 1.5 + recency * 1.5; // -1.5 (oldest) to -3.0 (most recent)
  }

  return score;
}

/**
 * Return videos sorted by personalised relevance score, highest first.
 * Falls back to rating order when no signals are present.
 */
export function getRecommendedVideos(
  videos: Video[],
  signals: RecommendationSignals
): Video[] {
  const { prefs, favoriteVideoIds } = signals;

  // Pre-compute tag/performer sets from content the user has already engaged with.
  // Used to surface similar-but-not-identical content.
  const likedTagIds = new Set<string>();
  const likedPerformerIds = new Set<string>();
  for (const vid of videos) {
    if (favoriteVideoIds.includes(vid.id) || prefs.likedVideoIds.includes(vid.id)) {
      vid.tags.forEach((t) => likedTagIds.add(t));
      vid.performers.forEach((p) => likedPerformerIds.add(p));
    }
  }

  return [...videos].sort(
    (a, b) =>
      scoreVideo(b, prefs, favoriteVideoIds, likedTagIds, likedPerformerIds) -
      scoreVideo(a, prefs, favoriteVideoIds, likedTagIds, likedPerformerIds)
  );
}

/**
 * True when the user has enough signals to warrant a "For You" row.
 */
export function hasPersonalization(
  prefs: UserPrefs,
  favoriteVideoIds: string[]
): boolean {
  return (
    prefs.onboardingTagIds.length > 0 ||
    prefs.onboardingPerformerIds.length > 0 ||
    prefs.favoritePerformerIds.length > 0 ||
    prefs.likedVideoIds.length > 0 ||
    favoriteVideoIds.length > 0
  );
}
