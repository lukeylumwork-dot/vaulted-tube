import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";
import { Button } from "@/components/ui/button";

type RowVariant = "default" | "featured" | "compact";

interface Props {
  title: string;
  videos: Video[];
  viewAllLink?: string;
  variant?: RowVariant;
}

const variantStyles: Record<RowVariant, { cardMin: string; cardMax: string; gap: string; titleClass: string }> = {
  featured: {
    cardMin: "min-w-[200px]",
    cardMax: "max-w-[200px]",
    gap: "gap-3",
    titleClass: "text-sm font-bold text-foreground tracking-[0.08em] uppercase",
  },
  default: {
    cardMin: "min-w-[150px]",
    cardMax: "max-w-[150px]",
    gap: "gap-2.5",
    titleClass: "text-sm font-semibold text-foreground tracking-[0.06em] uppercase",
  },
  compact: {
    cardMin: "min-w-[120px]",
    cardMax: "max-w-[120px]",
    gap: "gap-2",
    titleClass: "text-xs font-medium text-muted-foreground tracking-[0.1em] uppercase",
  },
};

export default function CategoryRow({ title, videos, viewAllLink, variant = "default" }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const styles = variantStyles[variant];

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-3">
          <h2 className={styles.titleClass}>{title}</h2>
          <div className="h-px flex-1 min-w-[24px] bg-border/40" />
        </div>
        <div className="flex items-center gap-1">
          {viewAllLink && (
            <a href={viewAllLink} className="text-[10px] text-primary hover:underline mr-1">
              View All
            </a>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => scroll("left")}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => scroll("right")}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className={`flex ${styles.gap} overflow-x-auto pb-1 scrollbar-none`} style={{ scrollbarWidth: "none" }}>
        {videos.map((v) => (
          <div key={v.id} className={`${styles.cardMin} ${styles.cardMax}`}>
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
