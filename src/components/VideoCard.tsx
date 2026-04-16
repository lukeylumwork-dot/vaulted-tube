import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { Video } from "@/types";
import { formatDuration, getPerformerById } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";

export default function VideoCard({ video }: { video: Video }) {
  const { toggleFavorite } = useCatalog();

  return (
    <Link to={`/video/${video.id}`} className="group block transition-transform duration-300 ease-out hover:scale-[1.03]">
      <div className="relative rounded overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-[0_4px_20px_hsl(var(--primary)/0.12)]">
        {/* Cinematic thumbnail */}
        <div
          className="aspect-video relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, ${video.thumbnailColor}44 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, ${video.thumbnailColor}33 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
            `,
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.6) 100%)",
          }} />

          {/* Strong bottom gradient for title area */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Soft top shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

          {/* Hover glow */}
          <div className="absolute inset-0 bg-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(video.id);
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`h-3 w-3 ${
                video.isFavorite ? "fill-destructive text-destructive opacity-100" : "text-foreground/70"
              }`}
              style={video.isFavorite ? { opacity: 1 } : {}}
            />
          </button>

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between">
            {/* Duration - prominent */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[11px] text-foreground font-semibold tracking-wide">
              <Clock className="h-3 w-3 text-foreground/80" />
              {formatDuration(video.duration)}
            </div>

            {/* Rating dots */}
            <div className="flex items-center gap-px">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-2 w-2 ${
                    i < video.rating ? "fill-star text-star" : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title-first metadata */}
      <div className="mt-1 px-0.5">
        <h3 className="text-[11px] font-bold text-foreground leading-snug truncate group-hover:text-primary transition-colors">
          {video.title}
        </h3>
      </div>
    </Link>
  );
}