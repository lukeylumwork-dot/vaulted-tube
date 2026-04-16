import { useCatalog } from "@/context/CatalogContext";
import { performers, tags, collections, getPerformerById, formatDuration } from "@/data/mockData";
import CategoryRow from "@/components/CategoryRow";
import PerformerCard from "@/components/PerformerCard";
import VideoCard from "@/components/VideoCard";
import { Link } from "react-router-dom";
import { Clock, Star, Play } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollFadeIn(0.1, delay);
  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const { videos } = useCatalog();

  const recentlyAdded = [...videos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 12);
  const favorites = videos.filter((v) => v.isFavorite);
  const topRated = [...videos].sort((a, b) => b.rating - a.rating).slice(0, 12);

  const featured = topRated[0];

  return (
    <div className="space-y-6">
      {/* Hero / Featured */}
      {featured && (
        <Link to={`/video/${featured.id}`} className="group block -mx-4 -mt-4 mb-4">
          <div className="relative w-full overflow-hidden" style={{ height: "clamp(260px, 42vh, 440px)" }}>
            {/* Background — fades in and slowly scales up */}
            <div className="absolute inset-0 animate-[heroBgIn_1.2s_ease-out_both] origin-center" style={{
              background: `
                radial-gradient(ellipse at 20% 25%, ${featured.thumbnailColor}66 0%, transparent 50%),
                radial-gradient(ellipse at 80% 55%, ${featured.thumbnailColor}40 0%, transparent 45%),
                radial-gradient(circle at 60% 20%, hsl(var(--primary) / 0.1) 0%, transparent 45%),
                radial-gradient(ellipse at 40% 90%, ${featured.thumbnailColor}20 0%, transparent 40%),
                hsl(var(--background))
              `,
            }} />
            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }} />
            {/* Stronger vignette for depth */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background) / 0.8) 100%)",
            }} />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/80 to-transparent" />
            {/* Top subtle shadow */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/40 to-transparent" />
            {/* Content — slides up and fades in with staggered delay */}
            <div className="absolute inset-0 flex items-end px-8 pb-10 animate-[heroContentIn_0.9s_ease-out_0.3s_both]">
              <div className="max-w-xl space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary/80 font-semibold">
                  <Star className="h-3 w-3 fill-star text-star" />
                  Featured
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 drop-shadow-sm">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(featured.duration)}
                  </span>
                  <span className="w-px h-3 bg-border/50" />
                  <span>
                    {featured.performers.map((id) => getPerformerById(id)?.name).filter(Boolean).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 pt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < featured.rating ? "fill-star text-star" : "text-muted-foreground/20"}`} />
                  ))}
                </div>
              </div>
              <div className="hidden sm:flex ml-auto mb-3 items-center justify-center w-14 h-14 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 animate-[heroContentIn_0.9s_ease-out_0.5s_both]">
                <Play className="h-6 w-6 text-foreground/40 group-hover:text-primary transition-colors duration-300 ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      )}

      <FadeInSection>
        <CategoryRow title="Recently Added" videos={recentlyAdded} variant="featured" />
      </FadeInSection>
      <FadeInSection delay={80}>
        <CategoryRow title="Favorites" videos={favorites} />
      </FadeInSection>
      <FadeInSection delay={160}>
        <CategoryRow title="Top Rated" videos={topRated} variant="compact" />
      </FadeInSection>

      {/* Performers Row */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Performers</h2>
            <div className="h-px flex-1 min-w-[24px] bg-border/40" />
          </div>
          <Link to="/performers" className="text-[10px] text-primary hover:underline">View All</Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {performers.map((p) => (
            <div key={p.id} className="min-w-[100px] w-[100px] flex-shrink-0">
              <PerformerCard performer={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Collections Grid */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Collections</h2>
            <div className="h-px flex-1 min-w-[24px] bg-border/40" />
          </div>
          <Link to="/collections" className="text-[10px] text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
          {collections.map((col) => {
            const c1 = col.id.charCodeAt(0) || 65;
            const c2 = col.id.charCodeAt(1) || 66;
            const gradAngle = (c1 * 13) % 360;
            const lightX = (c1 % 50) + 20;
            const lightY = (c2 % 40) + 15;
            const noiseOpacity = 0.03 + (c2 % 4) * 0.01;

            return (
              <Link
                key={col.id}
                to={`/collection/${col.id}`}
                className="group rounded-lg overflow-hidden relative transition-all duration-250 ease-out hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-transparent hover:border-primary/20"
              >
                <div
                  className="aspect-video relative overflow-hidden"
                  style={{
                    background: `
                      radial-gradient(ellipse at ${lightX}% ${lightY}%, ${col.coverColor}55 0%, transparent 55%),
                      radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, ${col.coverColor}30 0%, transparent 50%),
                      radial-gradient(circle at ${(c2 % 60) + 20}% ${(c1 % 40) + 10}%, hsl(var(--primary) / 0.0${3 + c1 % 5}) 0%, transparent 40%),
                      linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
                    `,
                  }}
                >
                  {/* Noise */}
                  <div className="absolute inset-0 mix-blend-overlay" style={{
                    opacity: noiseOpacity,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + c1 % 4}' numOctaves='${3 + c2 % 3}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: `${100 + (c2 % 50)}px ${100 + (c2 % 50)}px`,
                  }} />
                  {/* Abstract shape */}
                  <div className="absolute inset-0" style={{
                    opacity: 0.05 + (c1 % 3) * 0.01,
                    background: `radial-gradient(${c2 % 2 === 0 ? 'circle' : 'ellipse'} at ${(c2 % 60) + 20}% ${(c1 % 40) + 30}%, ${col.coverColor}45 0%, transparent ${35 + c1 % 15}%)`,
                  }} />
                  {/* Vignette */}
                  <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse at center, transparent 25%, hsl(var(--background) / 0.5) 100%)",
                  }} />
                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors duration-250">{col.name}</h3>
                    <p className="text-[9px] text-muted-foreground/50 mt-0.5 font-medium">{col.videoIds.length} items</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Items Grid */}
      <section>
        <div className="flex items-center gap-3 mb-2.5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Browse All</h2>
          <div className="h-px flex-1 bg-border/40" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2.5">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  );
}
