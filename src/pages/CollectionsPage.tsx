import { useCatalog } from "@/context/CatalogContext";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

export default function CollectionsPage() {
  const { videos, performers, tags, collections, loading, error, reload } = useCatalog();

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading catalog…</div>;
  if (error) return <div className="py-20 text-center"><p className="text-destructive mb-2">Could not load catalog.</p><button className="text-primary text-sm hover:underline" onClick={() => reload()}>Try again</button></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.length === 0 ? <p className="text-muted-foreground">No collections yet.</p> : collections.map((col) => {
          const liveCount = videos.filter((v) => v.collections.includes(col.id)).length;
          return (
            <Link
              key={col.id}
              to={`/collection/${col.id}`}
              className="card-hover rounded-lg p-5 border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: col.coverColor }}>
                  <FolderOpen className="h-5 w-5 text-foreground/60" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{col.name}</h3>
                  <p className="text-xs text-muted-foreground">{liveCount} items • Created {col.createdAt}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{col.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
