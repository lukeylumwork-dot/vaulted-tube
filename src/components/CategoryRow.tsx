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

const variantStyles: Record<RowVariant, {
  gap: string; titleClass: string; heroW: string; smallW: string; medW: string;
}> = {
  featured: {
    heroW: "min-w-[340px] max-w-[340px] sm:min-w-[400px] sm:max-w-[400px]",
    medW: "min-w-[220px] max-w-[220px] sm:min-w-[250px] sm:max-w-[250px]",
    smallW: "min-w-[170px] max-w-[170px] sm:min-w-[190px] sm:max-w-[190px]",
    gap: "gap-3",
    titleClass: "text-sm font-bold text-foreground tracking-[0.08em] uppercase",
  },
  default: {
    heroW: "min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px]",
    medW: "min-w-[185px] max-w-[185px] sm:min-w-[210px] sm:max-w-[210px]",
    smallW: "min-w-[140px] max-w-[140px] sm:min-w-[155px] sm:max-w-[155px]",
    gap: "gap-2.5",
    titleClass: "text-sm font-semibold text-foreground tracking-[0.06em] uppercase",
  },
  compact: {
    heroW: "min-w-[240px] max-w-[240px] sm:min-w-[260px] sm:max-w-[260px]",
    medW: "min-w-[155px] max-w-[155px] sm:min-w-[170px] sm:max-w-[170px]",
    smallW: "min-w-[115px] max-w-[115px] sm:min-w-[125px] sm:max-w-[125px]",
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

  const [hero, ...rest] = videos;

  // Pick width class for each remaining card — every 4th gets medium size for rhythm
  const getCardWidth = (index: number) => {
    return index % 4 === 2 ? styles.medW : styles.smallW;
  };

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
        {/* Hero — first item at 2x width */}
        <div className={`${styles.heroW} flex-shrink-0`}>
          <VideoCard video={hero} />
        </div>
        {rest.map((v, i) => (
          <div key={v.id} className={`${getCardWidth(i)} flex-shrink-0`}>
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
