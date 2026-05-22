import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Home, Users, Tag, FolderOpen, Settings, Film } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const { user, signInWithMagicLink, signOut } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAuthBusy(true);
    try {
      await signInWithMagicLink(email.trim());
      toast({ title: "Magic link sent", description: "Check your email to finish signing in." });
      setEmail("");
    } catch (error) {
      const description = error instanceof Error ? error.message : "Unable to send magic link.";
      toast({ title: "Sign in failed", description, variant: "destructive" });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    setAuthBusy(true);
    try {
      await signOut();
      toast({ title: "Signed out" });
    } catch (error) {
      const description = error instanceof Error ? error.message : "Unable to sign out.";
      toast({ title: "Sign out failed", description, variant: "destructive" });
    } finally {
      setAuthBusy(false);
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
            {user ? (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => void handleLogout()} disabled={authBusy}>
                Logout
              </Button>
            ) : (
              <form onSubmit={handleLogin} className="hidden lg:flex items-center gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for magic link"
                  className="h-8 w-48 text-xs bg-secondary border-border"
                  type="email"
                />
                <Button size="sm" className="h-8 text-xs" disabled={authBusy || !email.trim()} type="submit">
                  Login
                </Button>
              </form>
            )}
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
