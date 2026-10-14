import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, helperText, label, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-[44px] px-3.5 bg-surface text-text-main text-sm rounded-[12px] border border-border-subtle transition-all duration-150",
              "placeholder:text-text-muted/60",
              "focus:outline-none focus:border-brand-action focus:ring-2 focus:ring-brand-action/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background",
              error && "border-status-error focus:border-status-error focus:ring-status-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs font-medium text-status-error">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
