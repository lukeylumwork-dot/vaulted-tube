import { useCatalog } from "@/context/CatalogContext";
import { performers, tags, collections, getPerformerById, formatDuration } from "@/data/mockData";
import CategoryRow from "@/components/CategoryRow";
import PerformerCard from "@/components/PerformerCard";
import VideoCard from "@/components/VideoCard";
import { Link } from "react-router-dom";
import { Clock, Star, Play } from "lucide-react";

export default function HomePage() {
  const { videos } = useCatalog();

  const recentlyAdded = [...videos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 12);
  const favorites = videos.filter((v) => v.isFavorite);
  const topRated = [...videos].sort((a, b) => b.rating - a.rating).slice(0, 12);

  // Pick the top-rated recent item as featured
  const featured = topRated[0];

  return (
    <div className="space-y-5">
      {/* Hero / Featured */}
      {featured && (
        <Link to={`/video/${featured.id}`} className="group block -mx-4 -mt-4 mb-2">
          <div className="relative w-full overflow-hidden" style={{ height: "clamp(220px, 36vh, 380px)" }}>
            {/* Cinematic background */}
            <div className="absolute inset-0" style={{
              background: `
                radial-gradient(ellipse at 25% 30%, ${featured.thumbnailColor}55 0%, transparent 55%),
                radial-gradient(ellipse at 75% 50%, ${featured.thumbnailColor}30 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, hsl(var(--primary) / 0.08) 0%, transparent 60%),
                hsl(var(--background))
              `,
            }} />

            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }} />

            {/* Vignette */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.7) 100%)",
            }} />

            {/* Bottom fade into page */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end px-8 pb-8">
              <div className="max-w-lg space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary/70 font-medium">
                  <Star className="h-3 w-3 fill-star text-star" />
                  Featured
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(featured.duration)}
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span>
                    {featured.performers.map((id) => getPerformerById(id)?.name).filter(Boolean).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < featured.rating ? "fill-star text-star" : "text-muted-foreground/20"}`} />
                  ))}
                </div>
              </div>

              {/* Subtle play hint */}
              <div className="hidden sm:flex ml-auto mb-2 items-center justify-center w-12 h-12 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                <Play className="h-5 w-5 text-foreground/40 group-hover:text-primary transition-colors duration-300 ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      )}

      <CategoryRow title="Recently Added" videos={recentlyAdded} variant="featured" />
      <CategoryRow title="Favorites" videos={favorites} />
      <CategoryRow title="Top Rated" videos={topRated} variant="compact" />

      {/* Performers Row */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Performers</h2>
          <Link to="/performers" className="text-[10px] text-primary hover:underline">View All</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {performers.map((p) => (
            <div key={p.id} className="min-w-[100px] w-[100px] flex-shrink-0">
              <PerformerCard performer={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Collections Grid */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Collections</h2>
          <Link to="/collections" className="text-[10px] text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collection/${col.id}`}
              className="group rounded overflow-hidden relative transition-all duration-300 ease-out hover:scale-[1.03] shadow-sm hover:shadow-[0_4px_20px_hsl(var(--primary)/0.12)]"
            >
              <div
                className="aspect-video relative"
                style={{ background: `linear-gradient(135deg, ${col.coverColor}, hsl(var(--card)))` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-xs font-semibold text-foreground truncate">{col.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{col.videoIds.length} items</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Items Grid */}
      <section>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-2">Browse All</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  );
}