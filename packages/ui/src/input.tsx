import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@luxeverse/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-obsidian-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-neon-pink" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-lg border bg-obsidian-50 px-3 py-2 text-sm text-obsidian-900 placeholder:text-obsidian-400 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan disabled:opacity-50",
            error
              ? "border-error focus-visible:ring-error/50"
              : "border-obsidian-200 hover:border-obsidian-300",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-help`} className="text-xs text-obsidian-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
