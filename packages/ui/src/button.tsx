import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@luxeverse/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-metallic-champagne text-obsidian-950 hover:bg-metallic-gold",
        outline:
          "border border-obsidian-900/20 bg-transparent hover:bg-obsidian-900/5",
        ghost: "hover:bg-obsidian-900/5",
        luxury:
          "bg-obsidian-950 text-metallic-champagne hover:bg-obsidian-900 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
);

Button.displayName = "Button";
