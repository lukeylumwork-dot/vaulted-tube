import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
    <p className="text-muted-foreground mb-6">Page not found</p>
    <Link to="/" className="text-primary hover:underline flex items-center gap-1">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </Link>
  </div>
);

export default NotFound;
