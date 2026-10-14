import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "petrol" | "outline" | "ghost" | "danger";
  size?: "compact" | "default" | "large" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-action focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      primary:
        "bg-brand-action text-white hover:bg-brand-action/90 active:bg-brand-action/95 shadow-xs",
      secondary:
        "bg-surface text-text-main border border-border-subtle hover:bg-background active:bg-border-subtle/40",
      petrol:
        "bg-brand-petrol text-white hover:bg-brand-petrol/90 active:bg-brand-petrol/95 shadow-xs",
      outline:
        "border border-border-subtle bg-transparent text-text-main hover:bg-surface active:bg-border-subtle/30",
      ghost:
        "bg-transparent text-text-muted hover:text-text-main hover:bg-surface",
      danger:
        "bg-status-error text-white hover:bg-status-error/90 active:bg-status-error/95 shadow-xs",
    };

    // Alturas e paddings especificados no DESIGN.md:
    // Compacto: 36px | Padrão: 44px | Grande: 48px
    const sizeStyles = {
      compact: "h-[36px] px-3 text-sm rounded-[8px]",
      default: "h-[44px] px-4 text-sm rounded-[12px]",
      large: "h-[48px] px-6 text-base rounded-[12px]",
      icon: "h-[44px] w-[44px] rounded-[12px] p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Carregando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
