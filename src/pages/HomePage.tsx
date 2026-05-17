import { useRef, useMemo, useState, useEffect, useCallback } from "react";
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
  const topRated = [...videos]
    .sort((a, b) => b.rating - a.rating || b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 12);

  const featured = topRated[0];

  const sections = useMemo(() => [
    { id: "featured", label: "Featured" },
    { id: "recent", label: "Recently Added" },
    { id: "favorites", label: "Favorites" },
    { id: "top-rated", label: "Top Rated" },
    { id: "performers", label: "Performers" },
    { id: "collections", label: "Collections" },
    { id: "browse", label: "Browse All" },
  ], []);

  const [activeSection, setActiveSection] = useState("featured");
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Auto-scroll rail to keep active button visible
  useEffect(() => {
    const btn = railRef.current?.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-0">
      {/* Discovery Rail */}
      <div className="-mx-4 -mt-4 mb-4 sticky top-[theme(spacing.12)] z-30">
        <div className="bg-background/80 backdrop-blur-md border-b border-border/30">
          <div ref={railRef} className="flex items-center gap-0.5 px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {sections.map((s) => (
              <button
                key={s.id}
                data-section={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === s.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero / Featured */}
      {featured && (
        <Link id="featured" to={`/video/${featured.id}`} className="group block -mx-4 mb-8 scroll-mt-24">
          <div className="relative w-full overflow-hidden" style={{ height: "clamp(340px, 55vh, 560px)" }}>
            {/* Background — intensified gradients for dominance */}
            <div className="absolute inset-0 animate-[heroBgIn_1.2s_ease-out_both] origin-center" style={{
              background: `
                radial-gradient(ellipse at 15% 20%, ${featured.thumbnailColor}88 0%, transparent 50%),
                radial-gradient(ellipse at 75% 50%, ${featured.thumbnailColor}60 0%, transparent 45%),
                radial-gradient(circle at 55% 15%, hsl(var(--primary) / 0.15) 0%, transparent 45%),
                radial-gradient(ellipse at 35% 85%, ${featured.thumbnailColor}35 0%, transparent 40%),
                radial-gradient(ellipse at 90% 10%, ${featured.thumbnailColor}25 0%, transparent 35%),
                hsl(var(--background))
              `,
            }} />
            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }} />
            {/* Deep vignette */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, transparent 15%, hsl(var(--background) / 0.85) 100%)",
            }} />
            {/* Extended bottom fade — creates hard separation from content below */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/90 via-40% to-transparent" />
            {/* Top shadow */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/50 to-transparent" />
            {/* Content */}
            <div className="absolute inset-0 flex items-end px-8 pb-12 animate-[heroContentIn_0.9s_ease-out_0.3s_both]">
              <div className="max-w-xl space-y-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-primary/90 font-semibold">
                  <Star className="h-3 w-3 fill-star text-star" />
                  Featured
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-300 drop-shadow-md">
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
              <div className="hidden sm:flex ml-auto mb-4 items-center justify-center w-16 h-16 rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 animate-[heroContentIn_0.9s_ease-out_0.5s_both]">
                <Play className="h-7 w-7 text-foreground/40 group-hover:text-primary transition-colors duration-300 ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Content rows with scroll targets */}
      <div id="recent" className="mt-2 scroll-mt-24">
        <FadeInSection>
          <CategoryRow title="Recently Added" videos={recentlyAdded} variant="featured" />
        </FadeInSection>
      </div>

      <div id="favorites" className="mt-8 scroll-mt-24">
        <FadeInSection delay={80}>
          <CategoryRow title="Favorites" videos={favorites} />
        </FadeInSection>
      </div>

      <div id="top-rated" className="mt-5 scroll-mt-24">
        <FadeInSection delay={160}>
          <CategoryRow title="Top Rated" videos={topRated} variant="compact" />
        </FadeInSection>
      </div>

      <div id="performers" className="mt-10 scroll-mt-24">
        <FadeInSection>
          <section>
            <div className="flex items-center justify-between mb-3 pl-1">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Performers</h2>
                <div className="h-px flex-1 min-w-[24px] bg-border/40" />
              </div>
              <Link to="/performers" className="text-[10px] text-primary hover:underline">View All</Link>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {performers.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex-shrink-0 ${
                    i === 0
                      ? "min-w-[130px] w-[130px]"
                      : i % 3 === 1
                        ? "min-w-[110px] w-[110px]"
                        : "min-w-[100px] w-[100px]"
                  }`}
                >
                  <PerformerCard performer={p} />
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>
      </div>

      <div id="collections" className="mt-7 scroll-mt-24">
        <FadeInSection>
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Collections</h2>
                <span className="text-[10px] text-muted-foreground/50 font-medium tabular-nums">
                  {collections.length}
                </span>
                <div className="h-px flex-1 min-w-[24px] bg-border/40" />
              </div>
              <Link to="/collections" className="text-[10px] text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
              {collections.map((col, idx) => {
                const liveCount = videos.filter((v) => v.collections.includes(col.id)).length;
                const c1 = col.id.charCodeAt(0) || 65;
                const c2 = col.id.charCodeAt(1) || 66;
                const gradAngle = (c1 * 13) % 360;
                const lightX = (c1 % 50) + 20;
                const lightY = (c2 % 40) + 15;
                const noiseOpacity = 0.03 + (c2 % 4) * 0.01;
                // First item spans 2 columns for asymmetry
                const isWide = idx === 0;

                return (
                  <Link
                    key={col.id}
                    to={`/collection/${col.id}`}
                    className={`group rounded-lg overflow-hidden relative transition-all duration-250 ease-out hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-transparent hover:border-primary/20 ${
                      isWide ? "col-span-2 sm:col-span-2 lg:col-span-2" : ""
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${isWide ? "aspect-[2.5/1]" : "aspect-video"}`}
                      style={{
                        background: `
                          radial-gradient(ellipse at ${lightX}% ${lightY}%, ${col.coverColor}55 0%, transparent 55%),
                          radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, ${col.coverColor}30 0%, transparent 50%),
                          radial-gradient(circle at ${(c2 % 60) + 20}% ${(c1 % 40) + 10}%, hsl(var(--primary) / 0.0${3 + c1 % 5}) 0%, transparent 40%),
                          linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)
                        `,
                      }}
                    >
                      <div className="absolute inset-0 mix-blend-overlay" style={{
                        opacity: noiseOpacity,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + c1 % 4}' numOctaves='${3 + c2 % 3}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: `${100 + (c2 % 50)}px ${100 + (c2 % 50)}px`,
                      }} />
                      <div className="absolute inset-0" style={{
                        opacity: 0.05 + (c1 % 3) * 0.01,
                        background: `radial-gradient(${c2 % 2 === 0 ? 'circle' : 'ellipse'} at ${(c2 % 60) + 20}% ${(c1 % 40) + 30}%, ${col.coverColor}45 0%, transparent ${35 + c1 % 15}%)`,
                      }} />
                      <div className="absolute inset-0" style={{
                        background: "radial-gradient(ellipse at center, transparent 25%, hsl(var(--background) / 0.5) 100%)",
                      }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <h3 className={`font-bold text-foreground truncate group-hover:text-primary transition-colors duration-250 ${isWide ? "text-sm" : "text-xs"}`}>{col.name}</h3>
                        <p className="text-[9px] text-muted-foreground/50 mt-0.5 font-medium">{col.videoIds.length} items</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeInSection>
      </div>

      <div id="browse" className="mt-10 scroll-mt-24">
        <FadeInSection>
          <section>
            <div className="flex items-center gap-3 mb-3 pl-0.5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-[0.08em]">Browse All</h2>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2.5">
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        </FadeInSection>
      </div>
    </div>
  );
}
