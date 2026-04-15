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
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <a href={viewAllLink} className="text-xs text-primary hover:underline">
              View All
            </a>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        {videos.map((v) => (
          <div key={v.id} className="min-w-[200px] max-w-[200px]">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
