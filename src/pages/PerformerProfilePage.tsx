import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import VideoCard from "@/components/VideoCard";
import { Badge } from "@/components/ui/badge";

export default function PerformerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { videos, performers, tags, collections } = useCatalog();
  const performer = performers.find((p) => p.id === id);

  if (!performer) {
    return <div className="text-center py-20 text-muted-foreground">Performer not found</div>;
  }

  const performerVideos = videos.filter((v) => v.performers.includes(performer.id));

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex items-center gap-5 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-foreground/80"
          style={{ backgroundColor: performer.avatarColor }}
        >
          {performer.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{performer.name}</h1>
          {performer.aliases.length > 0 && (
            <p className="text-sm text-muted-foreground">aka {performer.aliases.join(", ")}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">{performerVideos.length} items</p>
          <div className="flex gap-2 mt-2">
            {performer.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
      </div>

      {performer.notes && (
        <p className="text-sm text-foreground/80 bg-secondary rounded-md p-3 mb-6">{performer.notes}</p>
      )}

      <h2 className="text-lg font-semibold text-foreground mb-4">Catalog Items</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {performerVideos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
