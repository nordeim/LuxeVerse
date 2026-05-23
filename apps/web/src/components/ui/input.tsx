"use client";

import * as React from "react";
import { cn } from "@luxeverse/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-obsidian-900"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-obsidian-900 placeholder:text-obsidian-400 focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus-visible:outline-error"
              : "border-obsidian-200 focus-visible:border-obsidian-400"
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-obsidian-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
