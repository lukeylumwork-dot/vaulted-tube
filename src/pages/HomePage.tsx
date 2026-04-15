import { useCatalog } from "@/context/CatalogContext";
import { performers, tags, collections, getVideosByCollection } from "@/data/mockData";
import CategoryRow from "@/components/CategoryRow";
import PerformerCard from "@/components/PerformerCard";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { videos } = useCatalog();

  const recentlyAdded = [...videos].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 8);
  const favorites = videos.filter((v) => v.isFavorite);
  const topRated = [...videos].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, Curator</h1>
        <p className="text-sm text-muted-foreground">
          {videos.length} items in your catalog • {favorites.length} favorites
        </p>
      </div>

      <CategoryRow title="Recently Added" videos={recentlyAdded} />
      <CategoryRow title="⭐ Favorites" videos={favorites} />
      <CategoryRow title="Top Rated" videos={topRated} />

      {/* Performers Row */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Performers</h2>
          <Link to="/performers" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {performers.map((p) => (
            <div key={p.id} className="min-w-[100px]">
              <PerformerCard performer={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Collections</h2>
          <Link to="/collections" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collection/${col.id}`}
              className="card-hover rounded-lg p-4 border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: col.coverColor }} />
                <div>
                  <h3 className="text-sm font-medium text-foreground">{col.name}</h3>
                  <p className="text-xs text-muted-foreground">{col.videoIds.length} items</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{col.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tags Cloud */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Tags</h2>
          <Link to="/tags" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 10).map((t) => (
            <Link
              key={t.id}
              to={`/tag/${t.id}`}
              className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {t.name} ({t.videoCount})
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
