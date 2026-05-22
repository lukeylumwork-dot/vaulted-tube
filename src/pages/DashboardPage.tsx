import { useState } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { Video } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Save, Upload, X } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import { uploadThumbnailForVideo } from "@/lib/thumbnailStorage";

const placeholderColors = [
  "hsl(199 60% 25%)", "hsl(265 50% 25%)", "hsl(142 50% 20%)",
  "hsl(38 60% 25%)", "hsl(320 50% 25%)", "hsl(170 50% 22%)",
];

export default function DashboardPage() {
  const { videos, performers, tags, collections, loading, error, reload, addVideo, updateVideo } = useCatalog();
  const { toast } = useToast();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [form, setForm] = useState({
    title: "", performers: [] as string[], tags: [] as string[],
    duration: "", rating: "3", notes: "", collections: [] as string[],
    videoUrl: "", thumbnailUrl: "", thumbnailStoragePath: "",
  });

  const resetForm = () => {
    setForm({ title: "", performers: [], tags: [], duration: "", rating: "3", notes: "", collections: [], videoUrl: "", thumbnailUrl: "", thumbnailStoragePath: "" });
    setEditingVideo(null);
    setMode("list");
  };

  const startEdit = (v: Video) => {
    setEditingVideo(v);
    setForm({
      title: v.title,
      performers: v.performers,
      tags: v.tags,
      duration: String(v.duration / 60),
      rating: String(v.rating),
      notes: v.notes,
      collections: v.collections,
      videoUrl: v.videoUrl ?? "",
      thumbnailUrl: v.thumbnailUrl ?? "",
      thumbnailStoragePath: v.thumbnailStoragePath ?? "",
    });
    setMode("edit");
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    const videoData: Video = {
      id: editingVideo?.id || `v${Date.now()}`,
      title: form.title,
      performers: form.performers,
      tags: form.tags,
      dateAdded: editingVideo?.dateAdded || new Date().toISOString().split("T")[0],
      duration: (parseInt(form.duration) || 0) * 60,
      rating: parseInt(form.rating) || 3,
      notes: form.notes,
      isFavorite: editingVideo?.isFavorite || false,
      collections: form.collections,
      thumbnailColor: editingVideo?.thumbnailColor || placeholderColors[Math.floor(Math.random() * placeholderColors.length)],
      videoUrl: form.videoUrl.trim() || undefined,
      videoStoragePath: undefined,
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      thumbnailStoragePath: form.thumbnailStoragePath.trim() || undefined,
    };

    setIsSaving(true);
    try {
      if (mode === "edit") {
        await updateVideo(videoData);
        toast({ title: "Item updated", description: "Changes were saved successfully." });
      } else {
        await addVideo(videoData);
        toast({ title: "Item added" });
      }
      resetForm();
    } catch (saveError) {
      const description = saveError instanceof Error ? saveError.message : "Unable to save changes.";
      toast({ title: "Save failed", description, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };



  const handleThumbnailUpload = async (file: File | null) => {
    if (!file) return;
    const baseId = editingVideo?.id || `v${Date.now()}`;
    setIsUploadingThumbnail(true);
    try {
      const uploaded = await uploadThumbnailForVideo(baseId, file);
      setForm((prev) => ({ ...prev, thumbnailUrl: uploaded.publicUrl, thumbnailStoragePath: uploaded.path }));
      toast({ title: "Thumbnail uploaded" });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Unable to upload thumbnail.";
      toast({ title: "Upload failed", description, variant: "destructive" });
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const toggleArrayItem = (field: "performers" | "tags" | "collections", item: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }));
  };

  if (mode === "list") {
    if (loading) return <div className="py-20 text-center text-muted-foreground">Loading catalog…</div>;
  if (error) return <div className="py-20 text-center"><p className="text-destructive mb-2">Could not load catalog.</p><button className="text-primary text-sm hover:underline" onClick={() => reload()}>Try again</button></div>;

  return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-semibold text-foreground uppercase tracking-wide">Manage Catalog</h1>
          <Button size="sm" onClick={() => setMode("add")} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
          {videos.map((v) => (
            <div key={v.id} className="relative group">
              <VideoCard video={v} />
              <button
                onClick={(e) => { e.preventDefault(); startEdit(v); }}
                aria-label={`Edit ${v.title}`}
                data-testid={`edit-video-${v.id}`}
                className="absolute top-1.5 left-1.5 p-1 rounded bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-2.5 w-2.5 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Add/Edit form
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {mode === "edit" ? "Edit Item" : "Add New Item"}
        </h1>
        <Button variant="ghost" size="sm" onClick={resetForm}><X className="h-3.5 w-3.5" /></Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="bg-secondary h-8 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Duration (min)</label>
            <Input type="number" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className="bg-secondary h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Rating (1-5)</label>
            <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} className="bg-secondary h-8 text-sm" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Performers</label>
          <div className="flex flex-wrap gap-1.5">
            {performers.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Toggle performer ${p.name}`}
                data-testid={`performer-toggle-${p.id}`}
                aria-pressed={form.performers.includes(p.id)}
                onClick={() => toggleArrayItem("performers", p.id)}
                className="rounded-full"
              >
                <Badge
                  variant={form.performers.includes(p.id) ? "default" : "outline"}
                  className="cursor-pointer text-[10px] px-2 py-0.5 pointer-events-none"
                >
                  {p.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Tags</label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Toggle tag ${t.name}`}
                data-testid={`tag-toggle-${t.id}`}
                aria-pressed={form.tags.includes(t.id)}
                onClick={() => toggleArrayItem("tags", t.id)}
                className="rounded-full"
              >
                <Badge
                  variant={form.tags.includes(t.id) ? "default" : "outline"}
                  className="cursor-pointer text-[10px] px-2 py-0.5 pointer-events-none"
                >
                  {t.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Collections</label>
          <div className="flex flex-wrap gap-1.5">
            {collections.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Toggle collection ${c.name}`}
                data-testid={`collection-toggle-${c.id}`}
                aria-pressed={form.collections.includes(c.id)}
                onClick={() => toggleArrayItem("collections", c.id)}
                className="rounded-full"
              >
                <Badge
                  variant={form.collections.includes(c.id) ? "default" : "outline"}
                  className="cursor-pointer text-[10px] px-2 py-0.5 pointer-events-none"
                >
                  {c.name}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">External Video URL</label>
          <Input value={form.videoUrl} onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://example.com/video" className="bg-secondary h-8 text-sm" />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Thumbnail URL</label>
          <Input value={form.thumbnailUrl} onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value }))} placeholder="https://... or upload below" className="bg-secondary h-8 text-sm" />
          <div className="mt-2">
            <label className="text-[10px] text-muted-foreground block mb-1">Upload thumbnail image (jpg/png/webp)</label>
            <Input type="file" accept="image/png,image/jpeg,image/webp" disabled={isUploadingThumbnail} onChange={(e) => void handleThumbnailUpload(e.target.files?.[0] ?? null)} className="bg-secondary text-xs" />
          </div>
          {form.thumbnailStoragePath ? <p className="text-[10px] text-muted-foreground mt-1">Stored path: {form.thumbnailStoragePath}</p> : null}
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1 block">Notes</label>
          <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="bg-secondary text-sm" rows={2} />
        </div>

        <Button onClick={() => void handleSave()} disabled={isSaving} className="w-full h-8 text-xs">
          <Save className="h-3 w-3 mr-1" /> {isSaving ? "Saving..." : isUploadingThumbnail ? "Uploading thumbnail..." : mode === "edit" ? "Update" : "Add Item"}
        </Button>
      </div>
    </div>
  );
}
