import { useState, useMemo, ReactNode } from "react";
import { tags as baseTags } from "@/data/mockData";
import { useCatalog } from "@/context/CatalogContext";
import CategoryCard from "@/components/CategoryCard";
import { Search, X } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

function FadeInSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollFadeIn(0.1, delay);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
      }}
    >
      {children}
    </div>
  );
}

const allCategories = Array.from(new Set(baseTags.map((t) => t.category)));

export default function TagsPage() {
  const { videos } = useCatalog();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Compute live tag counts from catalog state
  const tags = useMemo(
    () =>
      baseTags.map((t) => ({
        ...t,
        videoCount: videos.filter((v) => v.tags.includes(t.id)).length,
      })),
    [videos]
  );

  // Featured: top tags by live item count
  const featured = useMemo(() => {
    const topIds = tags
      .slice()
      .sort((a, b) => b.videoCount - a.videoCount)
      .slice(0, 4)
      .map((t) => t.id);
    return tags.filter((t) => topIds.includes(t.id));
  }, [tags]);

  const filtered = useMemo(() => {
    let result = tags;
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      result = result.filter((t) => t.category === activeCategory);
    }
    return result;
  }, [tags, query, activeCategory]);

  const showFeatured = !query.trim() && !activeCategory;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Categories</h1>
        <p className="text-xs text-muted-foreground/60">
          {filtered.length} of {tags.length} categories
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full pl-8 pr-8 py-1.5 rounded-md text-[11px] font-medium bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-primary/15 border-primary/25 text-primary"
                  : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured row */}
      {showFeatured && (
        <FadeInSection>
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">
              Featured
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {featured.map((t) => (
                <CategoryCard key={t.id} tag={t} featured />
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* All categories grid */}
      <FadeInSection delay={80}>
        <div className="space-y-2">
          {showFeatured && (
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">
              All Categories
            </span>
          )}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {filtered.map((t) => (
                <CategoryCard key={t.id} tag={t} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted-foreground/60">No categories match your search</p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                }}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
}
