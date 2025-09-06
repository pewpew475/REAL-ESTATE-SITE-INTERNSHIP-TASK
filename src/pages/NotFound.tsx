import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Home className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Property Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, the property you're looking for doesn't exist or has been removed from our listings.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full bg-gradient-primary">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Looking for something specific? Try our search filters on the homepage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
