import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "@/types";
import VideoCard from "./VideoCard";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  videos: Video[];
  viewAllLink?: string;
}

export default function CategoryRow({ title, videos, viewAllLink }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">{title}</h2>
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
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {videos.map((v) => (
          <div key={v.id} className="min-w-[150px] max-w-[150px]">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
