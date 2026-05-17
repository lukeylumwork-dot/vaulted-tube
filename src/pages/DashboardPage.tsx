import { useState } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { performers, tags, collections } from "@/data/mockData";
import { Video } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Save, X } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";

const placeholderColors = [
  "hsl(199 60% 25%)", "hsl(265 50% 25%)", "hsl(142 50% 20%)",
  "hsl(38 60% 25%)", "hsl(320 50% 25%)", "hsl(170 50% 22%)",
];

export default function DashboardPage() {
  const { videos, addVideo, updateVideo } = useCatalog();
  const { toast } = useToast();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [form, setForm] = useState({
    title: "", performers: [] as string[], tags: [] as string[],
    duration: "", rating: "3", notes: "", collections: [] as string[],
  });

  const resetForm = () => {
    setForm({ title: "", performers: [], tags: [], duration: "", rating: "3", notes: "", collections: [] });
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
    });
    setMode("edit");
  };

  const handleSave = () => {
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
    };

    if (mode === "edit") {
      updateVideo(videoData);
      toast({ title: "Item updated", description: "Changes were saved successfully." });
    } else {
      addVideo(videoData);
      toast({ title: "Item added" });
    }
    resetForm();
  };

  const toggleArrayItem = (field: "performers" | "tags" | "collections", item: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter((i) => i !== item) : [...prev[field], item],
    }));
  };

  if (mode === "list") {
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
          <label className="text-xs font-medium text-foreground mb-1 block">Notes</label>
          <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="bg-secondary text-sm" rows={2} />
        </div>

        <Button onClick={handleSave} className="w-full h-8 text-xs">
          <Save className="h-3 w-3 mr-1" /> {mode === "edit" ? "Update" : "Add Item"}
        </Button>
      </div>
    </div>
  );
}
