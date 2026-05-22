import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="py-20 text-center text-muted-foreground">Checking session…</div>;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;

  return <>{children}</>;
}
