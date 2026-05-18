import { useState, useMemo, ReactNode } from "react";
import { useCatalog } from "@/context/CatalogContext";
import PerformerCard from "@/components/PerformerCard";
import { Search, ChevronDown, X } from "lucide-react";
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

type SortOption = "items-desc" | "items-asc" | "a-z" | "z-a";

const sortLabels: Record<SortOption, string> = {
  "items-desc": "Most Items",
  "items-asc": "Fewest Items",
  "a-z": "A – Z",
  "z-a": "Z – A",
};



export default function PerformersPage() {
  const { videos, performers, loading, error, reload } = useCatalog();
  const allPerformerTags = Array.from(new Set(performers.flatMap((p) => p.tags)));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("items-desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading catalog…</div>;
  if (error) return <div className="py-20 text-center"><p className="text-destructive mb-2">Could not load catalog.</p><button className="text-primary text-sm hover:underline" onClick={() => reload()}>Try again</button></div>;

  const hasActiveFilters = selectedTags.length > 0 || query.trim().length > 0;

  // Compute live performer counts from catalog videos
  const performersWithCounts = useMemo(
    () =>
      performers.map((p) => ({
        ...p,
        videoCount: videos.filter((v) => v.performers.includes(p.id)).length,
      })),
    [videos]
  );

  const filtered = useMemo(() => {
    let result = [...performersWithCounts];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((t) => p.tags.includes(t))
      );
    }

    switch (sort) {
      case "items-desc":
        result.sort((a, b) => b.videoCount - a.videoCount);
        break;
      case "items-asc":
        result.sort((a, b) => a.videoCount - b.videoCount);
        break;
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [sort, selectedTags, query, performersWithCounts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSelectedTags([]);
    setQuery("");
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Performers</h1>
        <p className="text-xs text-muted-foreground/50">
          {filtered.length} of {performersWithCounts.length} performers
        </p>
      </div>

      {/* Inline controls — search, tags, sort all in one lightweight bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search performers…"
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

          {/* Sort */}
          <div className="relative ml-auto">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              {sortLabels[sort]}
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 min-w-[130px] rounded-md border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl py-1">
                  {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] transition-colors ${
                        sort === key
                          ? "text-primary font-medium bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Inline tag chips — subtle, not in a panel */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {allPerformerTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/40"
              }`}
            >
              {tag}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium text-muted-foreground/40 hover:text-foreground transition-colors flex items-center gap-1"
            >
              <X className="h-2.5 w-2.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content grid — the star of the page */}
      <FadeInSection delay={80}>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {filtered.map((p) => (
              <PerformerCard key={p.id} performer={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted-foreground/50">No performers found</p>
            <button
              onClick={clearAll}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </FadeInSection>
    </div>
  );
}
