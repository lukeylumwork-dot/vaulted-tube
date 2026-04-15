import { useParams, Link } from "react-router-dom";
import { Heart, Star, Clock, Calendar, ArrowLeft, Tag } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { getPerformerById, getTagById, formatDuration } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { videos, toggleFavorite } = useCatalog();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Video not found</p>
        <Link to="/" className="text-primary text-sm hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        {/* Thumbnail */}
        <div>
          <div
            className="aspect-video rounded-lg flex items-center justify-center"
            style={{ backgroundColor: video.thumbnailColor }}
          >
            <span className="text-foreground/20 text-sm uppercase tracking-wider">
              Metadata Only
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-foreground">{video.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(video.id)}
            >
              <Heart className={`h-5 w-5 ${video.isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </Button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < video.rating ? "fill-star text-star" : "text-muted-foreground/30"}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-2">{video.rating}/5</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDuration(video.duration)}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{video.dateAdded}</span>
          </div>

          {/* Performers */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Performers</h3>
            <div className="flex flex-wrap gap-2">
              {video.performers.map((pid) => {
                const p = getPerformerById(pid);
                return p ? (
                  <Link key={pid} to={`/performer/${pid}`}>
                    <Badge variant="secondary" className="hover:bg-primary/10 hover:text-primary cursor-pointer">{p.name}</Badge>
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tid) => {
                const t = getTagById(tid);
                return t ? (
                  <Link key={tid} to={`/tag/${tid}`}>
                    <Badge variant="outline" className="hover:bg-primary/10 hover:text-primary cursor-pointer">
                      <Tag className="h-3 w-3 mr-1" />{t.name}
                    </Badge>
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Notes */}
          {video.notes && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase mb-1">Notes</h3>
              <p className="text-sm text-foreground/80 bg-secondary rounded-md p-3">{video.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
