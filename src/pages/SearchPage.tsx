import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useCatalog } from "@/context/CatalogContext";
import VideoCard from "@/components/VideoCard";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const { videos, performers, tags, collections } = useCatalog();

  const results = useMemo(() => {
    if (!query) return [];
    return videos.filter((v) => {
      const titleMatch = v.title.toLowerCase().includes(query);
      const performerMatch = v.performers.some((pid) =>
        performers.find((p)=>p.id===pid)?.name.toLowerCase().includes(query)
      );
      const tagMatch = v.tags.some((tid) =>
        tags.find((t)=>t.id===tid)?.name.toLowerCase().includes(query)
      );
      const notesMatch = v.notes.toLowerCase().includes(query);
      return titleMatch || performerMatch || tagMatch || notesMatch;
    });
  }, [query, videos]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Search Results</h1>
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} for "{searchParams.get("q")}"
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No items match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
