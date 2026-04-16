import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Performer } from "@/types";
import { useState } from "react";

export default function PerformerCard({ performer }: { performer: Performer }) {
  const [isFav, setIsFav] = useState(false);

  // Per-card variation seeds
  const s1 = performer.id.charCodeAt(0) || 65;
  const s2 = performer.id.charCodeAt(1) || 66;
  const s3 = performer.id.charCodeAt(2) || 67;
  const gradAngle = (s1 * 11) % 360;
  const lightX = (s1 % 50) + 25;
  const lightY = (s2 % 40) + 15;
  const noiseOpacity = 0.03 + (s3 % 4) * 0.01;
  const shapeX = (s2 % 60) + 20;
  const shapeY = (s3 % 40) + 30;

  return (
    <Link to={`/performer/${performer.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden transition-all duration-250 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:border-primary/20 border border-transparent">
        <div
          className="aspect-[3/4] relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at ${lightX}% ${lightY}%, ${performer.avatarColor}55 0%, transparent 60%),
              radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, ${performer.avatarColor}25 0%, transparent 50%),
              radial-gradient(circle at ${(s3 % 70) + 15}% ${(s1 % 50) + 25}%, hsl(var(--primary) / 0.0${3 + s2 % 4}) 0%, transparent 40%),
              linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
            `,
          }}
        >
          {/* Noise */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              opacity: noiseOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + s1 % 4}' numOctaves='${3 + s2 % 3}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: `${100 + (s3 % 50)}px ${100 + (s3 % 50)}px`,
            }}
          />

          {/* Abstract shape variation */}
          <div className="absolute inset-0" style={{
            opacity: 0.06 + (s1 % 3) * 0.01,
            background: `radial-gradient(${s2 % 2 === 0 ? 'circle' : 'ellipse'} at ${shapeX}% ${shapeY}%, ${performer.avatarColor}50 0%, transparent ${40 + s1 % 15}%)`,
          }} />

          {/* Secondary glow */}
          <div className="absolute inset-0" style={{
            opacity: 0.03,
            background: `radial-gradient(circle at ${100 - shapeX}% ${(s1 % 30) + 10}%, hsl(var(--primary) / 0.15) 0%, transparent ${20 + s3 % 15}%)`,
          }} />

          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 25%, hsl(var(--background) / 0.55) 100%)",
          }} />

          {/* Initial letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-foreground/[0.06] select-none">{performer.name.charAt(0)}</span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFav(!isFav);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <Heart
              className={`h-3 w-3 transition-colors ${
                isFav ? "fill-destructive text-destructive" : "text-foreground/70"
              }`}
            />
          </button>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors duration-250 leading-snug">
              {performer.name}
            </h3>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5 font-medium">
              {performer.videoCount} {performer.videoCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
