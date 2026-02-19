import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex max-w-full rounded-xl bg-card-foreground shadow-lg hover:border-accent transition-all duration-500 transform hover:scale-105",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center mx-6", className)} {...props}>
    {children}
  </div>
));
CardTitle.displayName = "CardTitle";

const CardHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardTitle, CardHeader, CardContent, CardFooter };
