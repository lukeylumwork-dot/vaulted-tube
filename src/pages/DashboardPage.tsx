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
      toast({ title: "Item updated" });
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your catalog metadata</p>
          </div>
          <Button onClick={() => setMode("add")}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Items", value: videos.length },
            { label: "Performers", value: performers.length },
            { label: "Tags", value: tags.length },
            { label: "Collections", value: collections.length },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">All Items</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="relative group">
              <VideoCard video={v} />
              <button
                onClick={(e) => { e.preventDefault(); startEdit(v); }}
                className="absolute top-2 left-2 p-1.5 rounded-full bg-background/60 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-3 w-3 text-foreground" />
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{mode === "edit" ? "Edit Item" : "Add New Item"}</h1>
        <Button variant="ghost" onClick={resetForm}><X className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Title *</label>
          <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="bg-secondary" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Duration (minutes)</label>
            <Input type="number" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} className="bg-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Rating (1-5)</label>
            <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} className="bg-secondary" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Performers</label>
          <div className="flex flex-wrap gap-2">
            {performers.map((p) => (
              <Badge
                key={p.id}
                variant={form.performers.includes(p.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem("performers", p.id)}
              >
                {p.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge
                key={t.id}
                variant={form.tags.includes(t.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem("tags", t.id)}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Collections</label>
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <Badge
                key={c.id}
                variant={form.collections.includes(c.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleArrayItem("collections", c.id)}
              >
                {c.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Notes</label>
          <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} className="bg-secondary" rows={3} />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" /> {mode === "edit" ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </div>
  );
}
