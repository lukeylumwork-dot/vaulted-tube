import { Link } from "react-router-dom";
import { Performer } from "@/types";

export default function PerformerCard({ performer }: { performer: Performer }) {
  return (
    <Link to={`/performer/${performer.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden transition-all duration-250 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:border-primary/20 border border-transparent">
        <div
          className="aspect-[3/4] relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, ${performer.avatarColor}55 0%, transparent 60%),
              radial-gradient(ellipse at 50% 70%, ${performer.avatarColor}25 0%, transparent 50%),
              radial-gradient(circle at 30% 80%, hsl(var(--primary) / 0.05) 0%, transparent 40%),
              hsl(var(--card))
            `,
          }}
        >
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Abstract shape variation */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            background: `radial-gradient(circle at ${(performer.id.charCodeAt(1) % 50) + 25}% ${(performer.id.charCodeAt(1) % 30) + 40}%, ${performer.avatarColor}50 0%, transparent 50%)`,
          }} />

          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 25%, hsl(var(--background) / 0.55) 100%)",
          }} />

          {/* Initial letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground/8">{performer.name.charAt(0)}</span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Hover */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors duration-250">
              {performer.name}
            </h3>
            <p className="text-[9px] text-muted-foreground/60 mt-0.5 uppercase tracking-widest font-medium">
              {performer.videoCount} {performer.videoCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
