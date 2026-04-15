import { tags } from "@/data/mockData";
import { Link } from "react-router-dom";

export default function TagsPage() {
  const grouped = tags.reduce<Record<string, typeof tags>>((acc, tag) => {
    (acc[tag.category] ||= []).push(tag);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Tags</h1>
      {Object.entries(grouped).map(([category, catTags]) => (
        <div key={category} className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{category}</h2>
          <div className="flex flex-wrap gap-2">
            {catTags.map((t) => (
              <Link
                key={t.id}
                to={`/tag/${t.id}`}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {t.name}
                <span className="ml-2 text-xs text-muted-foreground">({t.videoCount})</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
