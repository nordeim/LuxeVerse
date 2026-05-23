import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow hover:bg-primary/90":
              variant === "default",
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground":
              variant === "outline",
            "hover:bg-accent hover:text-accent-foreground":
              variant === "ghost",
            "h-9 px-4 py-2 text-sm": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
