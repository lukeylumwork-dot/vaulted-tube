import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { Video } from "@/types";
import { formatDuration, getPerformerById } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";

export default function VideoCard({ video }: { video: Video }) {
  const { toggleFavorite } = useCatalog();

  // Derive a subtle tag from the video's first tag
  const primaryTag = video.tags[0] || null;

  return (
    <Link to={`/video/${video.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden transition-all duration-250 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:border-primary/20 border border-transparent">
        {/* Cinematic thumbnail */}
        <div
          className="aspect-video relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, ${video.thumbnailColor}44 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, ${video.thumbnailColor}33 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.06) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
            `,
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Abstract shape variation */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            background: `radial-gradient(circle at ${(video.id.charCodeAt(1) % 60) + 20}% ${(video.id.charCodeAt(2) % 40) + 30}%, ${video.thumbnailColor}60 0%, transparent 45%)`,
          }} />

          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 35%, hsl(var(--background) / 0.65) 100%)",
          }} />

          {/* Strong bottom gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Soft top shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

          {/* Hover glow */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(video.id);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3 w-3 ${
                video.isFavorite ? "fill-destructive text-destructive opacity-100" : "text-foreground/70"
              }`}
              style={video.isFavorite ? { opacity: 1 } : {}}
            />
          </button>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-end justify-between">
            {/* Duration badge */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[11px] text-foreground font-bold tracking-wide">
              <Clock className="h-3 w-3 text-foreground/80" />
              {formatDuration(video.duration)}
            </div>

            {/* Rating dots */}
            <div className="flex items-center gap-0.5">
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
      </div>

      {/* Title-first metadata */}
      <div className="mt-1.5 px-0.5 space-y-0.5">
        <h3 className="text-xs font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors duration-250">
          {video.title}
        </h3>
        {primaryTag && (
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-medium">
            {primaryTag}
          </span>
        )}
      </div>
    </Link>
  );
}
