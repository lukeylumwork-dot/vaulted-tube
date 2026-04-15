import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { tags } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";
import VideoCard from "@/components/VideoCard";

export default function TagDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { videos } = useCatalog();
  const tag = tags.find((t) => t.id === id);

  if (!tag) {
    return <div className="text-center py-20 text-muted-foreground">Tag not found</div>;
  }

  const tagVideos = videos.filter((v) => v.tags.includes(tag.id));

  return (
    <div className="animate-fade-in">
      <Link to="/tags" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Tags
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Tag className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{tag.name}</h1>
          <p className="text-sm text-muted-foreground">{tag.category} • {tagVideos.length} items</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tagVideos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
