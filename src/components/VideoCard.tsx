import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { Video } from "@/types";
import { formatDuration, getPerformerById } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";

export default function VideoCard({ video }: { video: Video }) {
  const { toggleFavorite } = useCatalog();

  return (
    <Link to={`/video/${video.id}`} className="group block">
      <div className="relative rounded overflow-hidden bg-card">
        {/* Thumbnail with gradient overlay */}
        <div
          className="aspect-video relative"
          style={{
            background: `linear-gradient(135deg, ${video.thumbnailColor}, hsl(var(--card)))`,
          }}
        >
          {/* Bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Duration badge */}
          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1 py-0.5 text-[10px] text-foreground font-medium">
            <Clock className="h-2.5 w-2.5" />
            {formatDuration(video.duration)}
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(video.id);
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3 w-3 ${
                video.isFavorite ? "fill-destructive text-destructive opacity-100" : "text-foreground/70"
              }`}
              style={video.isFavorite ? { opacity: 1 } : {}}
            />
          </button>

          {/* Rating stars in bottom left */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 ${
                  i < video.rating ? "fill-star text-star" : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1.5 px-0.5">
        <h3 className="text-xs font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
          {video.performers.map((id) => getPerformerById(id)?.name).filter(Boolean).join(", ")}
        </p>
      </div>
    </Link>
  );
}
