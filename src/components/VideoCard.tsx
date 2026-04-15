import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { Video } from "@/types";
import { formatDuration, getPerformerById } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";

export default function VideoCard({ video }: { video: Video }) {
  const { toggleFavorite } = useCatalog();

  return (
    <Link to={`/video/${video.id}`} className="group block card-hover">
      <div className="relative rounded-lg overflow-hidden">
        {/* Placeholder thumbnail */}
        <div
          className="aspect-video flex items-center justify-center"
          style={{ backgroundColor: video.thumbnailColor }}
        >
          <span className="text-foreground/30 text-xs font-medium uppercase tracking-wider">
            No Preview
          </span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-sm font-medium text-foreground">View Details</span>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 rounded px-1.5 py-0.5 text-xs text-foreground">
          <Clock className="h-3 w-3" />
          {formatDuration(video.duration)}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(video.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-background/60 hover:bg-background/80 transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              video.isFavorite ? "fill-destructive text-destructive" : "text-foreground/60"
            }`}
          />
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {video.performers.map((id) => getPerformerById(id)?.name).filter(Boolean).join(", ")}
        </p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < video.rating ? "fill-star text-star" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
