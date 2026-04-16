import React, { createContext, useContext, useState, useCallback } from "react";

export interface UserPrefs {
  hasOnboarded: boolean;
  onboardingTagIds: string[];
  onboardingPerformerIds: string[];
  // watchedVideoIds: ordered oldest → newest, capped at 50
  watchedVideoIds: string[];
  likedVideoIds: string[];
  favoritePerformerIds: string[];
}

interface UserPrefsContextType {
  prefs: UserPrefs;
  completeOnboarding: (tagIds: string[], performerIds: string[]) => void;
  skipOnboarding: () => void;
  markWatched: (videoId: string) => void;
  toggleLike: (videoId: string) => void;
  toggleFavoritePerformer: (performerId: string) => void;
}

const STORAGE_KEY = "vt_user_prefs";

const defaultPrefs: UserPrefs = {
  hasOnboarded: false,
  onboardingTagIds: [],
  onboardingPerformerIds: [],
  watchedVideoIds: [],
  likedVideoIds: [],
  favoritePerformerIds: [],
};

function loadPrefs(): UserPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPrefs;
    // Spread over defaults so new fields added later get proper initial values
    return { ...defaultPrefs, ...JSON.parse(stored) };
  } catch {
    return defaultPrefs;
  }
}

function savePrefs(prefs: UserPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage quota or private browsing — silently ignore
  }
}

const UserPrefsContext = createContext<UserPrefsContextType | null>(null);

export function UserPrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UserPrefs>(loadPrefs);

  const update = useCallback((updater: (p: UserPrefs) => UserPrefs) => {
    setPrefs((prev) => {
      const next = updater(prev);
      savePrefs(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(
    (tagIds: string[], performerIds: string[]) => {
      update((p) => ({
        ...p,
        hasOnboarded: true,
        onboardingTagIds: tagIds,
        onboardingPerformerIds: performerIds,
      }));
    },
    [update]
  );

  const skipOnboarding = useCallback(() => {
    update((p) => ({ ...p, hasOnboarded: true }));
  }, [update]);

  const markWatched = useCallback((videoId: string) => {
    update((p) => {
      // Deduplicate, append to end, cap at 50
      const without = p.watchedVideoIds.filter((id) => id !== videoId);
      return { ...p, watchedVideoIds: [...without, videoId].slice(-50) };
    });
  }, [update]);

  const toggleLike = useCallback((videoId: string) => {
    update((p) => {
      const liked = p.likedVideoIds.includes(videoId)
        ? p.likedVideoIds.filter((id) => id !== videoId)
        : [...p.likedVideoIds, videoId];
      return { ...p, likedVideoIds: liked };
    });
  }, [update]);

  const toggleFavoritePerformer = useCallback((performerId: string) => {
    update((p) => {
      const favs = p.favoritePerformerIds.includes(performerId)
        ? p.favoritePerformerIds.filter((id) => id !== performerId)
        : [...p.favoritePerformerIds, performerId];
      return { ...p, favoritePerformerIds: favs };
    });
  }, [update]);

  return (
    <UserPrefsContext.Provider
      value={{
        prefs,
        completeOnboarding,
        skipOnboarding,
        markWatched,
        toggleLike,
        toggleFavoritePerformer,
      }}
    >
      {children}
    </UserPrefsContext.Provider>
  );
}

export function useUserPrefs(): UserPrefsContextType {
  const ctx = useContext(UserPrefsContext);
  if (!ctx) throw new Error("useUserPrefs must be used within UserPrefsProvider");
  return ctx;
}
