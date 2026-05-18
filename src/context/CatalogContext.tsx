import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Video, Performer, Tag, Collection } from "@/types";
import { fetchCatalogData, upsertVideo } from "@/lib/catalogApi";

interface CatalogContextType {
  videos: Video[];
  performers: Performer[];
  tags: Tag[];
  collections: Collection[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateVideo: (video: Video) => Promise<void>;
  addVideo: (video: Video) => Promise<void>;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCatalogData();
      setVideos(data.videos);
      setPerformers(data.performers);
      setTags(data.tags);
      setCollections(data.collections);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const toggleFavorite = useCallback(async (id: string) => {
    const current = videos.find((v) => v.id === id);
    if (!current) return;
    const updated = { ...current, isFavorite: !current.isFavorite };
    setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    await upsertVideo(updated);
  }, [videos]);

  const updateVideo = useCallback(async (video: Video) => {
    setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
    await upsertVideo(video);
  }, []);

  const addVideo = useCallback(async (video: Video) => {
    setVideos((prev) => [video, ...prev]);
    await upsertVideo(video);
  }, []);

  return <CatalogContext.Provider value={{ videos, performers, tags, collections, loading, error, reload, toggleFavorite, updateVideo, addVideo }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
