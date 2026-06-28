import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "minimal";
}

export const PageHeader = ({ 
  title, 
  subtitle, 
  badge, 
  children, 
  className,
  variant = "default" 
}: PageHeaderProps) => {
  const variants = {
    default: "bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white",
    gradient: "bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-white",
    minimal: "bg-muted/50 border-b"
  };

  return (
    <div className={cn(variants[variant], "py-12 md:py-16", className)}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <span className={cn(
              "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium mb-4",
              variant === "minimal" 
                ? "bg-primary/10 text-primary" 
                : "bg-white/20 text-white backdrop-blur-sm"
            )}>
              {badge}
            </span>
          )}
          <h1 className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4",
            variant === "minimal" ? "text-foreground" : "text-white"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto",
              variant === "minimal" ? "text-muted-foreground" : "text-white/80"
            )}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide" | "full";
}

export const PageContainer = ({ 
  children, 
  className,
  size = "default" 
}: PageContainerProps) => {
  const sizes = {
    narrow: "max-w-4xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <div className={cn("container py-8 md:py-12", className)}>
      <div className={cn("mx-auto", sizes[size])}>
        {children}
      </div>
    </div>
  );
};

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PageSection = ({ 
  children, 
  className, 
  title, 
  subtitle 
}: PageSectionProps) => {
  return (
    <section className={cn("py-8 md:py-12", className)}>
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

export const PageDivider = () => (
  <div className="border-t my-8 md:my-12" />
);
