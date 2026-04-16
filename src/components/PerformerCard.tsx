import { Link } from "react-router-dom";
import { Performer } from "@/types";

export default function PerformerCard({ performer }: { performer: Performer }) {
  return (
    <Link to={`/performer/${performer.id}`} className="group block transition-transform duration-300 ease-out hover:scale-[1.03]">
      <div className="relative rounded overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-[0_4px_20px_hsl(var(--primary)/0.12)]">
        <div
          className="aspect-[3/4] relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, ${performer.avatarColor}55 0%, transparent 60%),
              radial-gradient(ellipse at 50% 70%, ${performer.avatarColor}25 0%, transparent 50%),
              hsl(var(--card))
            `,
          }}
        >
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.5) 100%)",
          }} />

          {/* Initial letter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground/10">{performer.name.charAt(0)}</span>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hover */}
          <div className="absolute inset-0 bg-primary/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {performer.name}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {performer.videoCount} {performer.videoCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}