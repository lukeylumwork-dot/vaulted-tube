import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEMO_PASS = "catalog2024";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASS) {
      sessionStorage.setItem("catalog_auth", "true");
      navigate("/");
    } else {
      setError("Invalid password. Hint: catalog2024");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <Film className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">MediaVault</h1>
          <p className="text-sm text-muted-foreground">
            Private metadata catalog — no hosted media
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Unlock Catalog
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          📋 Metadata-only prototype • No explicit content
        </p>
      </div>
    </div>
  );
}
