import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { Video } from "@/types";
import { formatDuration } from "@/lib/catalogApi";
import { useCatalog } from "@/context/CatalogContext";

export default function VideoCard({ video }: { video: Video }) {
  const { toggleFavorite } = useCatalog();

  // Derive a subtle tag from the video's first tag
  const primaryTag = video.tags[0] || null;

  // Per-card variation seeds
  const s1 = video.id.charCodeAt(0) || 65;
  const s2 = video.id.charCodeAt(1) || 66;
  const s3 = video.id.charCodeAt(2) || 67;
  const gradAngle = (s1 * 7) % 360;
  const lightX1 = (s1 % 60) + 15;
  const lightY1 = (s2 % 40) + 10;
  const lightX2 = 100 - lightX1;
  const lightY2 = 100 - lightY1;
  const noiseOpacity = 0.03 + (s3 % 5) * 0.01;
  const shapeX = (s2 % 70) + 15;
  const shapeY = (s3 % 50) + 25;
  const shapeSize = 35 + (s1 % 20);
  const accentOpacity = 4 + (s2 % 5);

  return (
    <Link to={`/video/${video.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden transition-all duration-250 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:border-primary/20 border border-transparent">
        {/* Cinematic thumbnail */}
        <div
          className="aspect-video relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at ${lightX1}% ${lightY1}%, ${video.thumbnailColor}${accentOpacity}8 0%, transparent 50%),
              radial-gradient(ellipse at ${lightX2}% ${lightY2}%, ${video.thumbnailColor}${accentOpacity - 1}0 0%, transparent 55%),
              radial-gradient(circle at ${(s3 % 80) + 10}% ${(s1 % 30) + 10}%, hsl(var(--primary) / 0.0${3 + s2 % 5}) 0%, transparent 40%),
              linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
            `,
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              opacity: noiseOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + s1 % 4}' numOctaves='${3 + s2 % 3}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: `${100 + (s3 % 60)}px ${100 + (s3 % 60)}px`,
            }}
          />

          {/* Abstract shape variation */}
          <div className="absolute inset-0" style={{
            opacity: 0.05 + (s1 % 4) * 0.01,
            background: `radial-gradient(${s1 % 2 === 0 ? 'circle' : 'ellipse'} at ${shapeX}% ${shapeY}%, ${video.thumbnailColor}55 0%, transparent ${shapeSize}%)`,
          }} />

          {/* Secondary accent shape */}
          <div className="absolute inset-0" style={{
            opacity: 0.03 + (s2 % 3) * 0.01,
            background: `radial-gradient(circle at ${100 - shapeX}% ${100 - shapeY}%, hsl(var(--primary) / 0.12) 0%, transparent ${25 + s3 % 15}%)`,
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
