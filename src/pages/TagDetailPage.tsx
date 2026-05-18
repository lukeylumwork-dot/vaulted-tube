import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import VideoCard from "@/components/VideoCard";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { ReactNode } from "react";

function FadeInSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollFadeIn(0.1, delay);
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
      }}
    >
      {children}
    </div>
  );
}

export default function TagDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { videos, performers, tags, collections } = useCatalog();
  const tag = tags.find((t) => t.id === id);

  if (!tag) {
    return <div className="text-center py-20 text-muted-foreground">Tag not found</div>;
  }

  const tagVideos = videos.filter((v) => v.tags.includes(tag.id));

  // Cinematic hero seeds
  const s1 = tag.id.charCodeAt(1) || 65;
  const s2 = tag.id.charCodeAt(2) || 66;
  const hue = (s1 * 37 + s2 * 13) % 360;
  const gradAngle = (s1 * 17) % 360;
  const lightX = (s1 % 50) + 25;
  const lightY = (s2 % 40) + 20;

  return (
    <div className="animate-fade-in">
      {/* Cinematic hero banner */}
      <div
        className="relative rounded-xl overflow-hidden mb-6 -mx-2"
        style={{ minHeight: 180 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at ${lightX}% ${lightY}%, hsl(${hue} 60% 35% / 0.55) 0%, transparent 55%),
              radial-gradient(ellipse at ${100 - lightX}% ${100 - lightY}%, hsl(${(hue + 40) % 360} 50% 30% / 0.3) 0%, transparent 50%),
              radial-gradient(circle at ${(s2 % 60) + 20}% ${(s1 % 40) + 30}%, hsl(var(--primary) / 0.08) 0%, transparent 45%),
              linear-gradient(${gradAngle}deg, hsl(var(--card)) 0%, hsl(var(--muted)) 50%, hsl(var(--background)) 100%)
            `,
          }}
        />
        {/* Noise */}
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.${7 + s1 % 4}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "140px",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background) / 0.6) 100%)" }} />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 via-20% to-transparent" />

        {/* Content */}
        <div className="relative px-5 pt-8 pb-5 flex flex-col justify-end" style={{ minHeight: 180 }}>
          <Link
            to="/tags"
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="h-3 w-3" /> Categories
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <TagIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight leading-tight">{tag.name}</h1>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5 font-medium">
                {tag.category} · {tagVideos.length} {tagVideos.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items grid */}
      <FadeInSection>
        <div className="space-y-3">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-semibold">
            Items
          </span>
          {tagVideos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {tagVideos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground/60">No items in this category yet</p>
            </div>
          )}
        </div>
      </FadeInSection>
    </div>
  );
}
