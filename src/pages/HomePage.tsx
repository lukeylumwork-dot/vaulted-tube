import { useCatalog } from "@/context/CatalogContext";
import { performers, tags, collections, getVideosByCollection } from "@/data/mockData";
import CategoryRow from "@/components/CategoryRow";
import PerformerCard from "@/components/PerformerCard";
import VideoCard from "@/components/VideoCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { videos } = useCatalog();

  const recentlyAdded = [...videos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 12);
  const favorites = videos.filter((v) => v.isFavorite);
  const topRated = [...videos].sort((a, b) => b.rating - a.rating).slice(0, 12);

  return (
    <div className="space-y-5">
      <CategoryRow title="Recently Added" videos={recentlyAdded} />
      <CategoryRow title="Favorites" videos={favorites} />
      <CategoryRow title="Top Rated" videos={topRated} />

      {/* Performers Row */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Performers</h2>
          <Link to="/performers" className="text-[10px] text-primary hover:underline">View All</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {performers.map((p) => (
            <div key={p.id} className="min-w-[80px]">
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
              className="group rounded overflow-hidden relative"
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
