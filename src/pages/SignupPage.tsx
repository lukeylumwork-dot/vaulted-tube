import { useState } from "react";
import { Link } from "react-router-dom";
import { Film, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a confirmation link. Please verify your email to sign in.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <Film className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">MediaVault</h1>
          <p className="text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-secondary border-border"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-secondary border-border"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
