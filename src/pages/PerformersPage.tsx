import { performers } from "@/data/mockData";
import PerformerCard from "@/components/PerformerCard";

export default function PerformersPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Performers</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
        {performers.map((p) => (
          <PerformerCard key={p.id} performer={p} />
        ))}
      </div>
    </div>
  );
}
