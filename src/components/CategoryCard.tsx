import { Link } from "react-router-dom";
import { Tag } from "@/types";

interface CategoryCardProps {
  tag: Tag;
  featured?: boolean;
}

// Deterministic vibrant palette — each card gets a bold, distinct colour identity
const PALETTE = [
  { bg: "from-rose-600/70 to-pink-900/60", accent: "hsl(350 80% 55%)", ring: "ring-rose-500/20" },
  { bg: "from-amber-500/60 to-orange-900/50", accent: "hsl(35 90% 50%)", ring: "ring-amber-500/20" },
  { bg: "from-emerald-500/60 to-teal-900/50", accent: "hsl(160 70% 40%)", ring: "ring-emerald-500/20" },
  { bg: "from-blue-500/60 to-indigo-900/50", accent: "hsl(220 80% 55%)", ring: "ring-blue-500/20" },
  { bg: "from-violet-500/60 to-purple-900/50", accent: "hsl(270 70% 55%)", ring: "ring-violet-500/20" },
  { bg: "from-cyan-500/60 to-sky-900/50", accent: "hsl(190 80% 45%)", ring: "ring-cyan-500/20" },
  { bg: "from-fuchsia-500/60 to-pink-900/50", accent: "hsl(300 70% 55%)", ring: "ring-fuchsia-500/20" },
  { bg: "from-lime-500/50 to-green-900/50", accent: "hsl(80 70% 45%)", ring: "ring-lime-500/20" },
  { bg: "from-red-600/60 to-rose-950/50", accent: "hsl(0 75% 50%)", ring: "ring-red-500/20" },
  { bg: "from-teal-500/60 to-emerald-950/50", accent: "hsl(175 65% 40%)", ring: "ring-teal-500/20" },
  { bg: "from-indigo-500/60 to-blue-950/50", accent: "hsl(240 70% 55%)", ring: "ring-indigo-500/20" },
  { bg: "from-yellow-500/50 to-amber-950/50", accent: "hsl(45 90% 50%)", ring: "ring-yellow-500/20" },
];

export default function CategoryCard({ tag, featured = false }: CategoryCardProps) {
  const s1 = tag.id.charCodeAt(1) || 65;
  const s2 = tag.id.charCodeAt(2) || 66;
  const palette = PALETTE[(s1 * 7 + s2 * 3) % PALETTE.length];
  const lightX = (s1 % 40) + 30;
  const lightY = (s2 % 30) + 20;

  return (
    <Link to={`/tag/${tag.id}`} className="group block">
      <div
        className={`relative rounded-xl overflow-hidden border border-white/[0.06] transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] group-hover:ring-2 ${palette.ring} ${
          featured ? "aspect-[16/9]" : "aspect-[3/2]"
        }`}
      >
        {/* Bold colour gradient base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${palette.bg}`} />

        {/* Radial light bloom — gives each card a unique glow position */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at ${lightX}% ${lightY}%, ${palette.accent} / 0.45, transparent 60%),
              radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, ${palette.accent} / 0.15, transparent 55%)
            `,
          }}
        />

        {/* Subtle shimmer / highlight edge */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${(s1 * 23) % 360}deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)`,
          }}
        />

        {/* Noise texture for depth */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.06,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + s1 % 4}' numOctaves='${3 + s2 % 2}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: `${120 + (s2 % 40)}px`,
          }}
        />

        {/* Bottom text-readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 via-40% to-transparent" />

        {/* Hover glow */}
        <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6">
          <h3
            className={`font-bold text-white truncate group-hover:text-primary transition-colors duration-250 leading-tight tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${
              featured ? "text-base" : "text-[13px]"
            }`}
          >
            {tag.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-white/60 font-medium tracking-wide drop-shadow-sm">
              {tag.videoCount} {tag.videoCount === 1 ? "item" : "items"}
            </span>
            <span className="text-[10px] text-white/30">•</span>
            <span className="text-[10px] text-white/40 font-medium drop-shadow-sm">{tag.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
