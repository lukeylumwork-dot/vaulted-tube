import React, { createContext, useContext, useState, useCallback } from "react";
import { videos as initialVideos } from "@/data/mockData";
import { Video } from "@/types";

interface CatalogContextType {
  videos: Video[];
  toggleFavorite: (id: string) => void;
  updateVideo: (video: Video) => void;
  addVideo: (video: Video) => void;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  const toggleFavorite = useCallback((id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  }, []);

  const updateVideo = useCallback((video: Video) => {
    setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
  }, []);

  const addVideo = useCallback((video: Video) => {
    setVideos((prev) => [video, ...prev]);
  }, []);

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
