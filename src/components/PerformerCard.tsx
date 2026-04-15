import { Link } from "react-router-dom";
import { Performer } from "@/types";

export default function PerformerCard({ performer }: { performer: Performer }) {
  return (
    <Link to={`/performer/${performer.id}`} className="group card-hover block text-center">
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-xl font-bold text-foreground/80 mb-2"
        style={{ backgroundColor: performer.avatarColor }}
      >
        {performer.name.charAt(0)}
      </div>
      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
        {performer.name}
      </p>
      <p className="text-xs text-muted-foreground">{performer.videoCount} items</p>
    </Link>
  );
}
