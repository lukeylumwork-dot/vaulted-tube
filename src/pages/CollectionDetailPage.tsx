import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import VideoCard from "@/components/VideoCard";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { videos, performers, tags, collections } = useCatalog();
  const collection = collections.find((c) => c.id === id);

  if (!collection) {
    return <div className="text-center py-20 text-muted-foreground">Collection not found</div>;
  }

  const collectionVideos = videos.filter((v) => v.collections.includes(collection.id));

  return (
    <div className="animate-fade-in">
      <Link to="/collections" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Collections
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: collection.coverColor }}>
          <FolderOpen className="h-6 w-6 text-foreground/60" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
          <p className="text-sm text-muted-foreground">{collection.description}</p>
          <p className="text-xs text-muted-foreground mt-1">{collectionVideos.length} items • Created {collection.createdAt}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {collectionVideos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
