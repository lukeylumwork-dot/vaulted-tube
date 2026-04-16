import { useState, useMemo, ReactNode } from "react";
import { performers, tags } from "@/data/mockData";
import PerformerCard from "@/components/PerformerCard";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
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

// Collect all unique performer tags
const allPerformerTags = Array.from(new Set(performers.flatMap((p) => p.tags)));

const itemCountRanges = [
  { label: "1 – 2", min: 1, max: 2 },
  { label: "3 – 4", min: 3, max: 4 },
  { label: "5+", min: 5, max: Infinity },
];

export default function PerformersPage() {
  const [sort, setSort] = useState<SortOption>("items-desc");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const hasActiveFilters = selectedTags.length > 0 || selectedRange !== null;

  const filtered = useMemo(() => {
    let result = [...performers];

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((t) => p.tags.includes(t))
      );
    }

    // Item count range filter
    if (selectedRange) {
      const range = itemCountRanges.find((r) => r.label === selectedRange);
      if (range) {
        result = result.filter(
          (p) => p.videoCount >= range.min && p.videoCount <= range.max
        );
      }
    }

    // Sort
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
  }, [sort, selectedTags, selectedRange]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedRange(null);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Performers</h1>
        <p className="text-xs text-muted-foreground/60">
          {filtered.length} of {performers.length} performers
        </p>
      </div>

      {/* Control bar */}
      <div className="flex items-center gap-2">
        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 border ${
            filtersOpen || hasActiveFilters
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          <SlidersHorizontal className="h-3 w-3" />
          Filters
          {hasActiveFilters && (
            <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold">
              {selectedTags.length + (selectedRange ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
          >
            {sortLabels[sort]}
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-md border border-border/60 bg-popover/95 backdrop-blur-xl shadow-xl py-1">
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
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

      {/* Filter panel */}
      {filtersOpen && (
        <div className="rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {allPerformerTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 border ${
                    selectedTags.includes(tag)
                      ? "bg-primary/15 border-primary/25 text-primary"
                      : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Item count */}
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">Item Count</span>
            <div className="flex flex-wrap gap-1.5">
              {itemCountRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() =>
                    setSelectedRange(selectedRange === range.label ? null : range.label)
                  }
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 border ${
                    selectedRange === range.label
                      ? "bg-primary/15 border-primary/25 text-primary"
                      : "bg-secondary/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <FadeInSection delay={80}>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
            {filtered.map((p) => (
              <PerformerCard key={p.id} performer={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground/60">No performers match your filters</p>
            <button
              onClick={clearFilters}
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
