import { Link } from "react-router-dom";
import { Tag } from "@/types";

interface CategoryCardProps {
  tag: Tag;
  featured?: boolean;
}

export default function CategoryCard({ tag, featured = false }: CategoryCardProps) {
  const s1 = tag.id.charCodeAt(1) || 65;
  const s2 = tag.id.charCodeAt(2) || 66;
  const gradAngle = (s1 * 17) % 360;
  const hue = (s1 * 37 + s2 * 13) % 360;
  const lightX = (s1 % 50) + 25;
  const lightY = (s2 % 40) + 20;

  return (
    <Link to={`/tag/${tag.id}`} className="group block">
      <div
        className={`relative rounded-lg overflow-hidden border border-transparent transition-all duration-250 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:border-primary/20 ${
          featured ? "aspect-[16/9]" : "aspect-[3/2]"
        }`}
        style={{
          background: `
            radial-gradient(ellipse at ${lightX}% ${lightY}%, hsl(${hue} 60% 35% / 0.5) 0%, transparent 55%),
            radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, hsl(${(hue + 40) % 360} 50% 30% / 0.3) 0%, transparent 50%),
            radial-gradient(circle at ${(s2 % 60) + 20}% ${(s1 % 40) + 30}%, hsl(var(--primary) / 0.06) 0%, transparent 45%),
            linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--muted)) 50%, hsl(var(--background)) 100%)
          `,
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + s1 % 4}' numOctaves='${3 + s2 % 2}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: `${120 + (s2 % 40)}px`,
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background) / 0.5) 100%)",
          }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-30% to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6">
          <h3
            className={`font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-250 leading-tight tracking-tight ${
              featured ? "text-base" : "text-[13px]"
            }`}
          >
            {tag.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground/60 font-medium tracking-wide">
              {tag.videoCount} {tag.videoCount === 1 ? "item" : "items"}
            </span>
            <span className="text-[10px] text-muted-foreground/40">•</span>
            <span className="text-[10px] text-muted-foreground/40 font-medium">{tag.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
