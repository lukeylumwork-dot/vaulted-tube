import React, { createContext, useContext, useState, useCallback } from "react";
import { videos as initialVideos } from "@/data/mockData";
import { Video } from "@/types";

interface CatalogContextType {
  videos: Video[];
  toggleFavorite: (id: string) => void;
  updateVideo: (video: Video) => void;
  addVideo: (video: Video) => void;
}

const STORAGE_KEY = "vt_catalog_videos";

function loadVideos(): Video[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Video[];
  } catch {
    // Corrupted storage — fall back to mock data
  }
  return initialVideos;
}

function saveVideos(videos: Video[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch {
    // Storage quota or private browsing — silently ignore
  }
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialiser: reads localStorage once on mount, falls back to mock data
  const [videos, setVideos] = useState<Video[]>(loadVideos);

  const setAndPersist = useCallback((updater: (prev: Video[]) => Video[]) => {
    setVideos((prev) => {
      const next = updater(prev);
      saveVideos(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setAndPersist((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  }, [setAndPersist]);

  const updateVideo = useCallback((video: Video) => {
    setAndPersist((prev) => prev.map((v) => (v.id === video.id ? video : v)));
  }, [setAndPersist]);

  const addVideo = useCallback((video: Video) => {
    setAndPersist((prev) => [video, ...prev]);
  }, [setAndPersist]);

  return (
    <CatalogContext.Provider value={{ videos, toggleFavorite, updateVideo, addVideo }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
