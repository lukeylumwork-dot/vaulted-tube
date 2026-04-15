import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Home, Users, Tag, FolderOpen, Settings, LogOut, Film } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const handleLogout = () => {
    sessionStorage.removeItem("catalog_auth");
    window.location.href = "/login";
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/performers", icon: Users, label: "Performers" },
    { to: "/tags", icon: Tag, label: "Tags" },
    { to: "/collections", icon: FolderOpen, label: "Collections" },
    { to: "/dashboard", icon: Settings, label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">MediaVault</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, performers, tags..."
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </form>

          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex gap-1 px-6 pb-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Metadata-only notice */}
      <div className="bg-secondary/50 border-b border-border">
        <p className="text-center text-xs text-muted-foreground py-1">
          📋 This prototype contains <strong>metadata only</strong> — no hosted media or explicit content
        </p>
      </div>

      <main className="px-6 py-6 max-w-[1600px] mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
