import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Home, Users, Tag, FolderOpen, Settings, Film } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/performers", icon: Users, label: "Performers" },
    { to: "/tags", icon: Tag, label: "Tags" },
    { to: "/collections", icon: FolderOpen, label: "Collections" },
    { to: "/dashboard", icon: Settings, label: "Manage" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <Film className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold text-foreground">MediaVault</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, performers, tags..."
                className="pl-8 h-8 text-sm bg-secondary border-border"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Metadata-only notice */}
      <div className="bg-secondary/30 border-b border-border/50">
        <p className="text-center text-[10px] text-muted-foreground py-0.5">
          📋 Metadata only — no hosted media or explicit content
        </p>
      </div>

      <main className="px-4 py-4 max-w-[1800px] mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
