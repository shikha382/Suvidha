import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  variant?: "default" | "light";
}

// Route mapping for automatic breadcrumb generation
const routeLabels: Record<string, string> = {
  "": "Home",
  "services": "Services",
  "about": "About Us",
  "departments": "Departments",
  "news": "News & Updates",
  "track": "Track Complaint",
  "submit": "Submit Complaint",
  "dashboard": "Dashboard",
  "rewards": "Rewards",
  "smart-city": "Smart City Hub",
  "status": "Status",
  "auth": "Login",
  "admin": "Admin Panel",
};

export const BreadcrumbNav = ({ 
  items,
  className,
  showHome = true,
  variant = "default"
}: BreadcrumbNavProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from path if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
      label: routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1),
      href: index < paths.length - 1 ? `/${paths.slice(0, index + 1).join("/")}` : undefined
    }));
  })();

  const isLight = variant === "light";

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      {showHome && (
        <>
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-1 transition-colors",
              isLight 
                ? "text-white/70 hover:text-white" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Home</span>
          </Link>
          {breadcrumbs.length > 0 && (
            <ChevronRight className={cn(
              "h-4 w-4",
              isLight ? "text-white/40" : "text-muted-foreground/50"
            )} />
          )}
        </>
      )}
      
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {item.href ? (
            <Link 
              to={item.href}
              className={cn(
                "transition-colors",
                isLight 
                  ? "text-white/70 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "font-medium",
              isLight ? "text-white" : "text-foreground"
            )}>
              {item.label}
            </span>
          )}
          
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className={cn(
              "h-4 w-4",
              isLight ? "text-white/40" : "text-muted-foreground/50"
            )} />
          )}
        </div>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
