import { Link } from "react-router-dom";
import { Performer } from "@/types";

export default function PerformerCard({ performer }: { performer: Performer }) {
  return (
    <Link to={`/performer/${performer.id}`} className="group block text-center">
      <div
        className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-base font-bold text-foreground/80 mb-1 ring-1 ring-border/50 group-hover:ring-primary/50 transition-all"
        style={{ backgroundColor: performer.avatarColor }}
      >
        {performer.name.charAt(0)}
      </div>
      <p className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors truncate">
        {performer.name}
      </p>
      <p className="text-[10px] text-muted-foreground">{performer.videoCount}</p>
    </Link>
  );
}
